/* ==========================================================================
   ReliefOS — Operational Command Dashboard
   Live telemetry, animated tactical radar, readiness score gauge,
   connectivity monitor, quick disaster navigation, and local activity stream.
   ========================================================================== */

import { Storage } from './storage.js';
import { PreparednessSystem, DISASTER_DATA } from './preparedness.js';
import { t } from './translations.js';

export const DashboardSystem = {
  radarAngle: 0,
  radarAnimFrame: null,
  simulatedBlips: [
    { x: 0.35, y: -0.4, alpha: 0.8, color: '#00E5FF', label: 'BUOY-WB-04' },
    { x: -0.5, y: 0.3, alpha: 0.6, color: '#FFB300', label: 'TIDE-SUNDARBAN' },
    { x: 0.6, y: 0.45, alpha: 0.7, color: '#00E5FF', label: 'RADAR-KOLKATA' }
  ],

  init() {
    this.startClock();
    this.initConnectivityMonitor();
    this.initTacticalRadar();
    this.updateReadinessGauge();
    this.renderDisasterOverviewCards();
    this.renderActivityStream();
    this.setupListeners();
  },

  setupListeners() {
    window.addEventListener('reliefos:checklist-updated', () => {
      this.updateReadinessGauge();
      this.renderDisasterOverviewCards();
    });

    window.addEventListener('reliefos:activity-updated', () => {
      this.renderActivityStream();
    });

    window.addEventListener('reliefos:language-changed', () => {
      this.renderDisasterOverviewCards();
      this.updateReadinessGauge();
    });
  },

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

      const clockEl = document.getElementById('hud-live-clock');
      const dateEl = document.getElementById('hud-live-date');

      if (clockEl) clockEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };

    updateTime();
    setInterval(updateTime, 1000);
  },

  initConnectivityMonitor() {
    const badge = document.getElementById('hud-network-badge');
    const label = document.getElementById('hud-network-label');

    const updateStatus = () => {
      const isOnline = navigator.onLine;
      if (badge && label) {
        if (isOnline) {
          badge.classList.remove('offline');
          label.textContent = t('onlineNotice');
        } else {
          badge.classList.add('offline');
          label.textContent = t('offlineNotice');
        }
      }
    };

    window.addEventListener('online', () => {
      updateStatus();
      window.dispatchEvent(new CustomEvent('reliefos:toast', {
        detail: { title: 'Network Restored', message: 'Live network connectivity is active.', type: 'success' }
      }));
    });

    window.addEventListener('offline', () => {
      updateStatus();
      window.dispatchEvent(new CustomEvent('reliefos:toast', {
        detail: { title: 'Offline Mode Active', message: 'Operating seamlessly on cached local survival data.', type: 'warning' }
      }));
    });

    updateStatus();
  },

  initTacticalRadar() {
    const canvas = document.getElementById('dashboard-radar-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 240;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = size / 2 - 8;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Radar Screen Background
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#060c1d';
      ctx.fill();

      // Range Circles
      [0.3, 0.6, 0.9].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(center, center, radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(center - radius, center);
      ctx.lineTo(center + radius, center);
      ctx.moveTo(center, center - radius);
      ctx.lineTo(center, center + radius);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.stroke();

      // Sweeping Beam Gradient
      this.radarAngle = (this.radarAngle + 0.035) % (Math.PI * 2);

      const sweepGrad = ctx.createRadialGradient(center, center, 0, center, center, radius);
      sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0.02)');

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, this.radarAngle - 0.4, this.radarAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(this.radarAngle) * radius, center + Math.sin(this.radarAngle) * radius);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Simulated blips
      this.simulatedBlips.forEach(blip => {
        const bx = center + blip.x * radius;
        const by = center + blip.y * radius;

        // Angle difference between blip and sweep beam
        const blipAngle = Math.atan2(blip.y * radius, blip.x * radius);
        let diff = (this.radarAngle - blipAngle) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;

        const glow = Math.max(0, 1 - diff / (Math.PI * 0.7));

        if (glow > 0.05) {
          ctx.beginPath();
          ctx.arc(bx, by, 3 + glow * 2, 0, Math.PI * 2);
          ctx.fillStyle = blip.color;
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 255, 255, ${glow})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Label
          ctx.fillStyle = `rgba(255, 255, 255, ${glow * 0.8})`;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(blip.label, bx + 6, by + 3);
        }
      });

      // Outer bezel ring
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      this.radarAnimFrame = requestAnimationFrame(render);
    };

    render();
  },

  updateReadinessGauge() {
    const checklistScore = PreparednessSystem.getGlobalChecklistScore();
    const analyzerState = Storage.getAnalyzerState();
    
    // Weighted combination: 60% checklist + 40% analyzer questionnaire (or 100% checklist if no analyzer yet)
    let finalScore = checklistScore;
    if (analyzerState && typeof analyzerState.score === 'number') {
      finalScore = Math.round(checklistScore * 0.5 + analyzerState.score * 0.5);
    }

    const valEl = document.getElementById('dash-readiness-val');
    const fillCircle = document.getElementById('dash-readiness-circle-fill');
    const badgeEl = document.getElementById('dash-readiness-level-badge');

    if (valEl) valEl.textContent = `${finalScore}%`;

    if (fillCircle) {
      // Circumference for r=45 is 2 * PI * 45 = 282.74
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (finalScore / 100) * circumference;
      fillCircle.style.strokeDashoffset = offset;

      if (finalScore < 40) {
        fillCircle.style.stroke = 'var(--status-danger)';
      } else if (finalScore < 75) {
        fillCircle.style.stroke = 'var(--status-warning)';
      } else {
        fillCircle.style.stroke = 'var(--status-safe)';
      }
    }

    if (badgeEl) {
      if (finalScore < 40) {
        badgeEl.textContent = 'NEEDS ATTENTION';
        badgeEl.className = 'badge badge-red';
      } else if (finalScore < 75) {
        badgeEl.textContent = 'MODERATE READINESS';
        badgeEl.className = 'badge badge-demo';
      } else {
        badgeEl.textContent = 'HIGH RESILIENCE';
        badgeEl.className = 'badge badge-verified';
      }
    }
  },

  renderDisasterOverviewCards() {
    const grid = document.getElementById('dash-disasters-cards');
    if (!grid) return;

    grid.innerHTML = Object.keys(DISASTER_DATA).map(key => {
      const data = DISASTER_DATA[key];
      const statsBefore = PreparednessSystem.calculatePhaseProgress(key, 'before');
      const statsDuring = PreparednessSystem.calculatePhaseProgress(key, 'during');
      const statsAfter = PreparednessSystem.calculatePhaseProgress(key, 'after');

      const total = statsBefore.total + statsDuring.total + statsAfter.total;
      const completed = statsBefore.completed + statsDuring.completed + statsAfter.completed;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

      return `
        <div class="hud-card disaster-card" data-key="${key}">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <img src="${data.icon}" alt="" class="disaster-card-icon" style="margin:0;">
              <span class="badge ${pct > 75 ? 'badge-verified' : pct > 30 ? 'badge-demo' : 'badge-cyan'}">
                ${pct}% READY
              </span>
            </div>
            <h4 style="font-size:1.1rem; font-weight:700; color:#FFFFFF; margin-bottom:0.35rem;">
              ${data.titleEn}
            </h4>
            <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
              ${data.contextEn}
            </p>
          </div>
          <div style="margin-top:1.25rem;">
            <div class="hud-progress-bar" style="margin-bottom:0.5rem;">
              <div class="hud-progress-fill" style="width: ${pct}%; background: ${data.color};"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted);">
              <span>${completed} of ${total} steps</span>
              <span style="color:var(--accent-cyan);">Open Guide →</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.disaster-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-key');
        PreparednessSystem.currentCategory = key;
        PreparednessSystem.renderCategoryTabs();
        PreparednessSystem.renderActiveDisasterGuide(key);
        // Navigate to preparedness view
        window.location.hash = '#preparedness';
      });
    });
  },

  renderActivityStream() {
    const container = document.getElementById('dash-activity-stream');
    if (!container) return;

    const list = Storage.getActivityLog();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.8rem;">
          ${t('dashNoActivity')}
        </div>
      `;
      return;
    }

    container.innerHTML = list.slice(0, 6).map(act => {
      const timeStr = new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0.5rem; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.82rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="width:6px; height:6px; border-radius:50%; background:var(--accent-cyan);"></span>
            <span style="color:var(--text-primary); font-family:var(--font-mono);">${this.escapeHtml(act.text)}</span>
          </div>
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted);">${timeStr}</span>
        </div>
      `;
    }).join('');
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
};
