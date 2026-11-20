/* ==========================================================================
   ReliefOS — Community Hazard Incident Reporting Demo
   All reports remain strictly on-device in LocalStorage.
   Clearly labelled "Local Draft — Not Submitted" with full filtering & search.
   ========================================================================== */

import { Storage } from './storage.js';
import { t } from './translations.js';

export const HAZARD_CATEGORIES = [
  { id: 'road_flooding', labelEn: 'Road Flooding / Waterlogging', labelBn: 'রাস্তা জলমগ্ন / জল জমা' },
  { id: 'fallen_tree', labelEn: 'Fallen Tree / Blocked Way', labelBn: 'গাছ ভেঙে পথ অবরুদ্ধ' },
  { id: 'power_outage', labelEn: 'Power Outage / Snapped Wire', labelBn: 'বিদ্যুৎহীনতা / ছেঁড়া তার' },
  { id: 'infrastructure', labelEn: 'Damaged Embankment / Culvert', labelBn: 'ক্ষতিগ্রস্ত বাঁধ বা কালভার্ট' },
  { id: 'structural_hazard', labelEn: 'Building Structural Crack', labelBn: 'ভবনে বিপজ্জনক ফাটল' }
];

export const ReportsSystem = {
  currentFilter: 'all',
  currentSearchQuery: '',
  stagedImageBase64: null,

  init() {
    this.populateCategorySelect();
    this.renderReportsList();
    this.setupListeners();
  },

  populateCategorySelect() {
    const select = document.getElementById('report-hazard-type');
    if (!select) return;

    select.innerHTML = HAZARD_CATEGORIES.map(c => `
      <option value="${c.id}">${c.labelEn}</option>
    `).join('');
  },

  setupListeners() {
    // Form submission
    const form = document.getElementById('form-incident-report');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveDraft();
      });
    }

    // Photo input preview
    const photoInput = document.getElementById('report-photo-input');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB for browser local storage.');
            photoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (re) => {
            this.stagedImageBase64 = re.target.result;
            const previewContainer = document.getElementById('report-photo-preview');
            if (previewContainer) {
              previewContainer.innerHTML = `
                <img src="${this.stagedImageBase64}" alt="Preview" style="max-height:120px; border-radius:6px; border:1px solid var(--border-subtle); margin-top:0.5rem;">
                <button type="button" class="btn btn-outline btn-sm" id="btn-remove-photo" style="margin-top:0.4rem;">Remove Photo</button>
              `;
              document.getElementById('btn-remove-photo')?.addEventListener('click', () => {
                this.stagedImageBase64 = null;
                photoInput.value = '';
                previewContainer.innerHTML = '';
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Autofill location button
    const autofillBtn = document.getElementById('btn-autofill-location');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => {
        const loc = Storage.getLocation();
        const locInput = document.getElementById('report-location-input');
        if (locInput) {
          locInput.value = `${loc.name} (${loc.lat.toFixed(4)}°N, ${loc.lon.toFixed(4)}°E)`;
        }
      });
    }

    // Filter selector
    const filterSelect = document.getElementById('filter-report-category');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.renderReportsList();
      });
    }

    // Search input
    const searchInput = document.getElementById('search-report-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value.toLowerCase().trim();
        this.renderReportsList();
      });
    }
  },

  handleSaveDraft() {
    const typeSelect = document.getElementById('report-hazard-type');
    const severitySelect = document.getElementById('report-severity');
    const locationInput = document.getElementById('report-location-input');
    const descInput = document.getElementById('report-desc-input');

    if (!typeSelect || !locationInput || !descInput) return;

    const type = typeSelect.value;
    const severity = severitySelect?.value || 'Medium';
    const location = locationInput.value.trim();
    const desc = descInput.value.trim();

    if (!location || !desc) {
      alert('Please fill out both the landmark location and incident description.');
      return;
    }

    const reportObj = {
      id: `rep-${Date.now()}`,
      type,
      typeName: typeSelect.options[typeSelect.selectedIndex].text,
      severity,
      location,
      description: desc,
      photoUrl: this.stagedImageBase64,
      status: 'Local Draft — Not Submitted',
      timestamp: Date.now()
    };

    Storage.saveReport(reportObj);

    // Reset Form
    locationInput.value = '';
    descInput.value = '';
    this.stagedImageBase64 = null;
    const photoInput = document.getElementById('report-photo-input');
    if (photoInput) photoInput.value = '';
    const previewContainer = document.getElementById('report-photo-preview');
    if (previewContainer) previewContainer.innerHTML = '';

    // Close Modal if open
    const modal = document.getElementById('modal-create-report');
    if (modal) modal.classList.remove('active');

    this.renderReportsList();

    window.dispatchEvent(new CustomEvent('reliefos:toast', {
      detail: {
        title: 'Draft Saved Locally',
        message: 'Your incident report is stored safely in your browser storage only.',
        type: 'success'
      }
    }));
  },

  renderReportsList() {
    const container = document.getElementById('community-reports-list');
    if (!container) return;

    let reports = Storage.getReports();

    // Filter
    if (this.currentFilter !== 'all') {
      reports = reports.filter(r => r.type === this.currentFilter);
    }

    // Search
    if (this.currentSearchQuery) {
      reports = reports.filter(r => 
        (r.typeName && r.typeName.toLowerCase().includes(this.currentSearchQuery)) ||
        (r.location && r.location.toLowerCase().includes(this.currentSearchQuery)) ||
        (r.description && r.description.toLowerCase().includes(this.currentSearchQuery))
      );
    }

    if (reports.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted); font-size:0.9rem;">
          <p>${t('noReportsFound')}</p>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted); margin-top:0.5rem; display:block;">
            All records are strictly client-side local drafts.
          </span>
        </div>
      `;
      return;
    }

    container.innerHTML = reports.map(r => {
      const severityColor = r.severity === 'Critical' ? '#FF1744' : r.severity === 'High' ? '#FF9100' : '#00E5FF';
      return `
        <div class="hud-card" style="padding:1.25rem; border-left: 3px solid ${severityColor}; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="badge badge-demo">LOCAL DRAFT — NOT SUBMITTED</span>
                <span class="badge" style="background:${severityColor}22; color:${severityColor}; border:1px solid ${severityColor}55;">
                  ${r.severity.toUpperCase()}
                </span>
              </div>
              <h3 style="font-size:1.05rem; font-weight:700; color:#FFFFFF;">${this.escapeHtml(r.typeName || r.type)}</h3>
              <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-cyan);">
                📍 ${this.escapeHtml(r.location)}
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">
                ${new Date(r.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.45;">
            ${this.escapeHtml(r.description)}
          </p>

          ${r.photoUrl ? `
            <div style="margin-top:0.25rem;">
              <img src="${r.photoUrl}" alt="Photo Proof" style="max-height:140px; border-radius:6px; border:1px solid var(--border-subtle); object-fit:cover;">
            </div>
          ` : ''}

          <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem; margin-top:0.25rem;">
            <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-muted);">
              ID: ${r.id} // BROWSER STORAGE ONLY
            </span>
            <button class="btn btn-outline btn-sm btn-delete-report" data-id="${r.id}" style="color:var(--status-danger); border-color:rgba(255,23,68,0.3);">
              Delete Draft
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-delete-report').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(t('deleteReportConfirm'))) {
          Storage.deleteReport(id);
          this.renderReportsList();
          window.dispatchEvent(new CustomEvent('reliefos:toast', {
            detail: { title: 'Draft Removed', message: 'Report draft was deleted.', type: 'info' }
          }));
        }
      });
    });
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
};
