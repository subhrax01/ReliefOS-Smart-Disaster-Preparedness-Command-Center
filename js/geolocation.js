/* ==========================================================================
   ReliefOS — Smart Geolocation & Tactical Grid
   Permission-based browser geolocation. Coordinates stay 100% on-device.
   Includes West Bengal District Presets and Tactical Canvas Reticle.
   ========================================================================== */

import { Storage } from './storage.js';
import { t } from './translations.js';

export const WB_DISTRICTS = [
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, zone: 'South Bengal / Coastal Delta' },
  { name: 'North 24 Parganas (Barasat)', lat: 22.7210, lon: 88.4837, zone: 'Sundarban Delta Border' },
  { name: 'South 24 Parganas (Sundarbans)', lat: 22.1500, lon: 88.6000, zone: 'High Cyclone Vulnerability' },
  { name: 'Howrah', lat: 22.5958, lon: 88.2636, zone: 'Hooghly River Basin' },
  { name: 'Hooghly (Chinsurah)', lat: 22.9031, lon: 88.3968, zone: 'Gangetic Flood Zone' },
  { name: 'Purba Medinipur (Digha/Tamluk)', lat: 21.6266, lon: 87.5074, zone: 'Coastal Storm Surge Zone' },
  { name: 'Paschim Medinipur', lat: 22.4257, lon: 87.3199, zone: 'Rarh Plateau' },
  { name: 'Jhargram', lat: 22.4500, lon: 86.9800, zone: 'Forest / Heatwave Zone' },
  { name: 'Bankura', lat: 23.2324, lon: 87.0715, zone: 'Severe Summer Heatwave' },
  { name: 'Purulia', lat: 23.3322, lon: 86.3652, zone: 'Chota Nagpur Fringe' },
  { name: 'Nadia (Krishnanagar)', lat: 23.4013, lon: 88.5028, zone: 'Bhagirathi Floodplain' },
  { name: 'Murshidabad (Baharampur)', lat: 24.0984, lon: 88.2679, zone: 'Ganges River Erosion' },
  { name: 'Purba Bardhaman', lat: 23.2324, lon: 87.8615, zone: 'Damodar Valley Basin' },
  { name: 'Paschim Bardhaman (Asansol)', lat: 23.6739, lon: 86.9524, zone: 'Industrial / Mining Zone' },
  { name: 'Birbhum (Suri)', lat: 23.9054, lon: 87.5246, zone: 'Mayurakshi Basin' },
  { name: 'Malda (English Bazar)', lat: 25.0108, lon: 88.1411, zone: 'Mahananda Floodplain' },
  { name: 'Uttar Dinajpur (Raiganj)', lat: 25.6170, lon: 88.1245, zone: 'North Bengal Plains' },
  { name: 'Dakshin Dinajpur (Balurghat)', lat: 25.2215, lon: 88.7656, zone: 'Atrai Basin' },
  { name: 'Jalpaiguri', lat: 26.5414, lon: 88.7196, zone: 'Teesta / Dooars Flood Zone' },
  { name: 'Alipurduar', lat: 26.4919, lon: 89.5271, zone: 'Sub-Himalayan Foothills' },
  { name: 'Cooch Behar', lat: 26.3452, lon: 89.4482, zone: 'Torsa River Floodplain' },
  { name: 'Darjeeling', lat: 27.0410, lon: 88.2663, zone: 'Seismic Zone IV / Landslide Risk' },
  { name: 'Kalimpong', lat: 27.0594, lon: 88.4695, zone: 'Seismic Zone IV / Landslide Risk' }
];

export const GeoSystem = {
  currentLocation: null,
  canvasAnimId: null,

  init() {
    this.currentLocation = Storage.getLocation();
    this.populateDistrictSelect();
    this.renderCurrentLocationUI();
    this.initMapCanvas();
  },

  populateDistrictSelect() {
    const select = document.getElementById('select-wb-district');
    if (!select) return;

    select.innerHTML = `<option value="">-- ${t('selectDistrict')} --</option>`;
    WB_DISTRICTS.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.name;
      opt.textContent = `${d.name} (${d.zone})`;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      const selectedName = e.target.value;
      if (!selectedName) return;
      const found = WB_DISTRICTS.find(d => d.name === selectedName);
      if (found) {
        this.setLocation({
          lat: found.lat,
          lon: found.lon,
          name: `${found.name}, West Bengal`,
          isManual: true,
          accuracy: 'Manual Zone Preset',
          timestamp: Date.now()
        });
      }
    });
  },

  requestGPS() {
    if (!('geolocation' in navigator)) {
      alert('Geolocation API is not supported in this browser.');
      return;
    }

    const btn = document.getElementById('btn-detect-gps');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="skeleton" style="display:inline-block; width:16px; height:16px; border-radius:50%;"></span> Acquiring Fix...`;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        this.setLocation({
          lat: parseFloat(latitude.toFixed(5)),
          lon: parseFloat(longitude.toFixed(5)),
          name: `GPS Fix (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`,
          isManual: false,
          accuracy: `±${Math.round(accuracy)} meters`,
          timestamp: Date.now()
        });

        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m22 2-7 20-4-9-9-4Z"/></svg> ${t('requestLocationBtn')}`;
        }

        window.dispatchEvent(new CustomEvent('reliefos:toast', {
          detail: {
            title: 'GPS Fix Acquired',
            message: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Acc: ±${Math.round(accuracy)}m)`,
            type: 'success'
          }
        }));
      },
      (err) => {
        console.warn('[ReliefOS Geo] Location error:', err);
        let msg = 'Unable to acquire location fix.';
        if (err.code === 1) msg = 'Location access denied. Please select your district manually.';
        else if (err.code === 2) msg = 'Location position unavailable.';
        else if (err.code === 3) msg = 'GPS acquisition timed out.';

        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m22 2-7 20-4-9-9-4Z"/></svg> ${t('requestLocationBtn')}`;
        }

        window.dispatchEvent(new CustomEvent('reliefos:toast', {
          detail: { title: 'GPS Notice', message: msg, type: 'warning' }
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  },

  setLocation(locData) {
    this.currentLocation = locData;
    Storage.saveLocation(locData);
    this.renderCurrentLocationUI();
    this.drawTacticalMap();
    window.dispatchEvent(new CustomEvent('reliefos:location-updated', { detail: locData }));
  },

  renderCurrentLocationUI() {
    const loc = this.currentLocation || Storage.getLocation();

    // Header chip
    const headerChipText = document.getElementById('header-location-name');
    if (headerChipText) {
      headerChipText.textContent = loc.name || 'Kolkata, WB';
    }

    // Coordinates display fields in Location View
    const latEl = document.getElementById('geo-disp-lat');
    const lonEl = document.getElementById('geo-disp-lon');
    const nameEl = document.getElementById('geo-disp-name');
    const accEl = document.getElementById('geo-disp-acc');
    const timeEl = document.getElementById('geo-disp-time');
    const mapLink = document.getElementById('geo-map-external-link');

    if (latEl) latEl.textContent = `${loc.lat.toFixed(5)}° N`;
    if (lonEl) lonEl.textContent = `${loc.lon.toFixed(5)}° E`;
    if (nameEl) nameEl.textContent = loc.name;
    if (accEl) accEl.textContent = loc.accuracy || 'N/A';
    if (timeEl) timeEl.textContent = new Date(loc.timestamp).toLocaleTimeString();

    if (mapLink) {
      mapLink.href = `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lon}#map=14/${loc.lat}/${loc.lon}`;
    }
  },

  copyCoordinates() {
    const loc = this.currentLocation || Storage.getLocation();
    const str = `${loc.lat.toFixed(6)}, ${loc.lon.toFixed(6)} (${loc.name})`;
    navigator.clipboard.writeText(str).then(() => {
      window.dispatchEvent(new CustomEvent('reliefos:toast', {
        detail: { title: 'Coordinates Copied', message: str, type: 'info' }
      }));
    }).catch(() => {
      alert(`Coordinates: ${str}`);
    });
  },

  initMapCanvas() {
    const canvas = document.getElementById('tactical-grid-canvas');
    if (!canvas) return;

    this.drawTacticalMap();
    window.addEventListener('resize', () => this.drawTacticalMap());
  },

  drawTacticalMap() {
    const canvas = document.getElementById('tactical-grid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    ctx.fillStyle = '#060c1d';
    ctx.fillRect(0, 0, width, height);

    // Subtle tactical grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Range Rings
    [40, 80, 120].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Crosshairs
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy);
    ctx.lineTo(cx + 130, cy);
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx, cy + 130);
    ctx.stroke();

    // Cardinal Points
    ctx.fillStyle = '#00E5FF';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N (000°)', cx, cy - 135);
    ctx.fillText('S (180°)', cx, cy + 145);
    ctx.fillText('W', cx - 142, cy + 3);
    ctx.fillText('E', cx + 142, cy + 3);

    // Center User Location Beacon
    const loc = this.currentLocation || Storage.getLocation();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#00E676';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Outer ripple
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.5)';
    ctx.stroke();

    // Coordinates HUD overlay
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`LOC: ${loc.lat.toFixed(4)}°N, ${loc.lon.toFixed(4)}°E`, 15, 25);
    ctx.fillStyle = '#8B9BB4';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`REGION: ${loc.name}`, 15, 42);
    ctx.fillText(`MODE: ${loc.isManual ? 'ZONE PRESET' : 'GPS POSITION FIX'}`, 15, 57);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFB300';
    ctx.fillText('SIMULATED TACTICAL VECTOR GRID', width - 15, 25);
  }
};
