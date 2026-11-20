/* ==========================================================================
   ReliefOS — Main Application Orchestrator
   Bootstraps modules, manages futuristic intro sequence, service workers,
   modals, and global toast notifications.
   ========================================================================== */

import { initLanguage, t } from './translations.js';
import { VoiceSystem } from './voice.js';
import { GeoSystem } from './geolocation.js';
import { EmergencySystem } from './emergency.js';
import { PreparednessSystem } from './preparedness.js';
import { ReportsSystem } from './reports.js';
import { DashboardSystem } from './dashboard.js';
import { NavigationSystem } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Subsystems
  initLanguage();
  VoiceSystem.init();
  GeoSystem.init();
  EmergencySystem.init();
  PreparednessSystem.init();
  ReportsSystem.init();
  DashboardSystem.init();
  NavigationSystem.init();

  // Setup Global Services
  initIntroSequence();
  initServiceWorker();
  initToastManager();
  initGlobalModalHandlers();
});

/* ==========================================================================
   FUTURISTIC INTRO EXPERIENCE
   ========================================================================== */
function initIntroSequence() {
  const overlay = document.getElementById('intro-overlay');
  const progressFill = document.getElementById('intro-progress-fill');
  const logText = document.getElementById('intro-log-text');
  const skipBtn = document.getElementById('btn-skip-intro');

  if (!overlay) return;

  const logs = [
    'Preparing local preparedness dashboard...',
    'Loading disaster preparedness references...',
    'Preparing offline cache support...',
    'Preparing emergency dial shortcut (112)...',
    'ReliefOS dashboard ready.'
  ];

  let progress = 0;
  let logIndex = 0;
  let isSkipped = false;

  const dismissIntro = () => {
    if (isSkipped) return;
    isSkipped = true;
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 600);
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissIntro);
  }

  const interval = setInterval(() => {
    if (isSkipped) {
      clearInterval(interval);
      return;
    }

    progress += 4;
    if (progressFill) progressFill.style.width = `${progress}%`;

    const nextLogIdx = Math.floor((progress / 100) * logs.length);
    if (nextLogIdx !== logIndex && nextLogIdx < logs.length) {
      logIndex = nextLogIdx;
      if (logText) logText.textContent = logs[logIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(dismissIntro, 350);
    }
  }, 45); // ~1.3 seconds total
}

/* ==========================================================================
   SERVICE WORKER REGISTRATION (OFFLINE CACHE)
   ========================================================================== */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {
          console.log('[ReliefOS SW] ServiceWorker successfully registered:', reg.scope);
          // Check cache state
          if ('caches' in window) {
            caches.has('reliefos-core-v1.0.0').then((hasCache) => {
              if (hasCache) {
                console.log('[ReliefOS SW] Cache storage verified ready.');
              }
            });
          }
        })
        .catch((err) => {
          console.warn('[ReliefOS SW] ServiceWorker registration notice:', err);
        });
    });
  }
}

/* ==========================================================================
   GLOBAL TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function initToastManager() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  window.addEventListener('reliefos:toast', (e) => {
    const { title, message, type = 'info', duration = 4000 } = e.detail;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  });
}

/* ==========================================================================
   GLOBAL ACCESSIBLE MODAL CONTROLS
   ========================================================================== */
function initGlobalModalHandlers() {
  // Triggers with data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.add('active');
    });
  });

  // Closers with data-close-modal
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Click on modal backdrop outside modal box
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Escape key closes open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}
