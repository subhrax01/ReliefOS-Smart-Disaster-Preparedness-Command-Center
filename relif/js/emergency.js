/* ==========================================================================
   ReliefOS — Emergency Assistance Center & Contact Manager
   Integrates India's official 112 emergency dialing workflow with safe confirmation.
   Manages client-side encrypted emergency contacts with one-tap dialing.
   ========================================================================== */

import { Storage } from './storage.js';
import { t } from './translations.js';

export const OFFICIAL_HELPLINES = [
  {
    number: '112',
    name: 'National Universal Emergency (ERSS)',
    dept: 'Government of India',
    purpose: 'Police, Fire, Ambulance & Disaster Response integration across all states',
    badge: 'UNIVERSAL 24/7'
  },
  {
    number: '1070',
    name: 'West Bengal State Disaster Control Room',
    dept: 'Disaster Management & Civil Defence Dept, Nabanna',
    purpose: 'State-level cyclone, flood, and disaster coordination toll-free',
    badge: 'WB STATE LEVEL'
  },
  {
    number: '1077',
    name: 'District Disaster Control Room (DDMA)',
    dept: 'District Magistrate Office',
    purpose: 'Local district administrative disaster response & relief camps',
    badge: 'DISTRICT LEVEL'
  },
  {
    number: '101',
    name: 'Fire & Emergency Rescue Services',
    dept: 'West Bengal Fire Services',
    purpose: 'Fire suppression, building collapse, hazardous chemical response',
    badge: 'FIRE DISPATCH'
  },
  {
    number: '108',
    name: 'Emergency Medical Ambulance Service',
    dept: 'Health & Family Welfare Dept',
    purpose: 'Critical patient transit, trauma care, and mobile life support',
    badge: 'AMBULANCE'
  },
  {
    number: '100',
    name: 'Police Emergency Assistance',
    dept: 'West Bengal & Kolkata Police',
    purpose: 'Immediate civil safety, patrol dispatch, law and order protection',
    badge: 'POLICE'
  },
  {
    number: '1091',
    name: 'Women Emergency Helpline',
    dept: 'Ministry of Women & Child Development',
    purpose: 'Toll-free 24-hour emergency safety and immediate shelter assistance',
    badge: 'WOMEN SAFETY'
  },
  {
    number: '1098',
    name: 'National Childline Emergency',
    dept: 'Childline India Foundation',
    purpose: 'Emergency aid and protection for children in distress or hazard zones',
    badge: 'CHILD PROTECTION'
  }
];

export const EmergencySystem = {
  init() {
    this.renderOfficialHelplines();
    this.renderPersonalContacts();
    this.setupListeners();
  },

  setupListeners() {
    // SOS triggers across app
    document.querySelectorAll('.trigger-sos-112').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCallConfirmationModal('112', 'Universal Emergency (ERSS India)');
      });
    });

    // Add contact form submit
    const contactForm = document.getElementById('form-add-contact');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveContact();
      });
    }
  },

  openCallConfirmationModal(number, name) {
    const modal = document.getElementById('modal-emergency-confirm');
    const targetNumberEl = document.getElementById('sos-confirm-target-number');
    const targetNameEl = document.getElementById('sos-confirm-target-name');
    const dialLink = document.getElementById('btn-confirm-dial-112');

    if (modal && targetNumberEl && dialLink) {
      targetNumberEl.textContent = number;
      if (targetNameEl) targetNameEl.textContent = name;
      dialLink.href = `tel:${number}`;
      modal.classList.add('active');
    }
  },

  closeCallConfirmationModal() {
    const modal = document.getElementById('modal-emergency-confirm');
    if (modal) modal.classList.remove('active');
  },

  renderOfficialHelplines() {
    const container = document.getElementById('official-helplines-grid');
    if (!container) return;

    container.innerHTML = OFFICIAL_HELPLINES.map((h) => `
      <div class="hud-card helpline-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <span class="badge badge-cyan">${h.badge}</span>
            <span style="font-family:var(--font-mono); font-size:1.4rem; font-weight:800; color:#00E5FF; letter-spacing:0.05em;">
              ${h.number}
            </span>
          </div>
          <h4 style="font-size:1rem; font-weight:700; color:#FFFFFF; margin-bottom:0.25rem;">${h.name}</h4>
          <p style="font-size:0.75rem; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:0.5rem;">${h.dept}</p>
          <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${h.purpose}</p>
        </div>
        <div style="margin-top:1.25rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06);">
          <button class="btn btn-outline btn-sm helpline-dial-btn" data-number="${h.number}" data-name="${h.name}" style="width:100%;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Dial ${h.number}
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.helpline-dial-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = btn.getAttribute('data-number');
        const name = btn.getAttribute('data-name');
        this.openCallConfirmationModal(num, name);
      });
    });
  },

  renderPersonalContacts() {
    const list = document.getElementById('personal-contacts-list');
    if (!list) return;

    const contacts = Storage.getContacts();

    if (contacts.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted); font-size:0.85rem;">
          No personal emergency contacts saved yet. Click "+ Add Personal Contact" above.
        </div>
      `;
      return;
    }

    list.innerHTML = contacts.map(c => `
      <div class="hud-card" style="padding:1rem 1.25rem; display:flex; align-items:center; justify-content:space-between; gap:1rem;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.25rem;">
            <h4 style="font-size:0.98rem; font-weight:700; color:#FFFFFF;">${this.escapeHtml(c.name)}</h4>
            <span class="badge ${c.isOfficial ? 'badge-verified' : 'badge-cyan'}">${this.escapeHtml(c.relationship)}</span>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.88rem; color:var(--accent-cyan); margin-bottom:0.25rem;">
            📞 ${this.escapeHtml(c.phone)}
          </div>
          ${c.notes ? `<div style="font-size:0.78rem; color:var(--text-muted);">${this.escapeHtml(c.notes)}</div>` : ''}
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-primary btn-sm btn-call-personal" data-phone="${this.escapeHtml(c.phone)}" data-name="${this.escapeHtml(c.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call
          </button>
          ${!c.isOfficial ? `
            <button class="btn btn-outline btn-sm btn-delete-contact" data-id="${c.id}" title="Remove Contact" style="color:var(--status-danger); border-color:rgba(255,23,68,0.3);">
              ✕
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Attach call handlers
    list.querySelectorAll('.btn-call-personal').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.getAttribute('data-phone');
        const name = btn.getAttribute('data-name');
        this.openCallConfirmationModal(phone, name);
      });
    });

    // Attach delete handlers
    list.querySelectorAll('.btn-delete-contact').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Remove this emergency contact?')) {
          Storage.deleteContact(id);
          this.renderPersonalContacts();
          window.dispatchEvent(new CustomEvent('reliefos:toast', {
            detail: { title: 'Contact Removed', message: 'The contact has been deleted.', type: 'info' }
          }));
        }
      });
    });
  },

  handleSaveContact() {
    const nameInput = document.getElementById('input-contact-name');
    const relationInput = document.getElementById('input-contact-relation');
    const phoneInput = document.getElementById('input-contact-phone');
    const notesInput = document.getElementById('input-contact-notes');

    if (!nameInput || !phoneInput) return;

    const name = nameInput.value.trim();
    const relation = relationInput?.value.trim() || 'Family/Friend';
    const phone = phoneInput.value.trim();
    const notes = notesInput?.value.trim() || '';

    if (!name || !phone) {
      alert('Please provide at least a name and phone number.');
      return;
    }

    Storage.saveContact({
      name,
      relationship: relation,
      phone,
      notes,
      isOfficial: false
    });

    // Reset form
    nameInput.value = '';
    if (relationInput) relationInput.value = '';
    phoneInput.value = '';
    if (notesInput) notesInput.value = '';

    // Close modal
    const modal = document.getElementById('modal-add-contact');
    if (modal) modal.classList.remove('active');

    this.renderPersonalContacts();

    window.dispatchEvent(new CustomEvent('reliefos:toast', {
      detail: { title: 'Contact Saved', message: `${name} has been added to your local device contacts.`, type: 'success' }
    }));
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
};
