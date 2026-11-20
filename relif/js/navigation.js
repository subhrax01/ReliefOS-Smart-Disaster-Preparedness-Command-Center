/* ==========================================================================
   ReliefOS — Navigation, Routing, Global Search & Settings Controller
   ========================================================================== */

import { Storage } from './storage.js';
import { setLanguage, getLanguage, t } from './translations.js';
import { PreparednessSystem, DISASTER_DATA } from './preparedness.js';
import { OFFICIAL_HELPLINES } from './emergency.js';

export const NavigationSystem = {
  currentRoute: 'dashboard',

  init() {
    this.setupHashRouting();
    this.setupSidebar();
    this.setupSearchModal();
    this.setupSettingsView();
    this.setupAnalyzer();
  },

  setupHashRouting() {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      this.navigateTo(hash);
    };

    window.addEventListener('hashchange', handleHash);
    // Initial route
    handleHash();

    // Nav item links
    document.querySelectorAll('[data-route]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        window.location.hash = `#${route}`;
      });
    });
  },

  navigateTo(route) {
    const validRoutes = ['dashboard', 'preparedness', 'emergency', 'location', 'analyzer', 'reports', 'settings'];
    const targetRoute = validRoutes.includes(route) ? route : 'dashboard';
    this.currentRoute = targetRoute;

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`view-${targetRoute}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update sidebar nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-route') === targetRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setupSidebar() {
    const collapseBtn = document.getElementById('btn-sidebar-collapse');
    const sidebar = document.getElementById('app-sidebar');
    const mainWrapper = document.getElementById('app-main-wrapper');
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const backdrop = document.getElementById('sidebar-backdrop');

    // Desktop Collapse Toggle
    if (collapseBtn && sidebar && mainWrapper) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainWrapper.classList.toggle('sidebar-collapsed');
      });
    }

    // Mobile Hamburger Menu
    if (mobileMenuBtn && sidebar && backdrop) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        backdrop.classList.add('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }
  },

  setupSearchModal() {
    const modal = document.getElementById('modal-quick-search');
    const trigger = document.getElementById('btn-search-trigger');
    const closeBtn = document.getElementById('btn-search-close');
    const input = document.getElementById('search-global-input');
    const resultsContainer = document.getElementById('search-global-results');

    if (!modal || !trigger) return;

    const openSearch = () => {
      modal.classList.add('active');
      if (input) {
        input.value = '';
        input.focus();
        this.renderSearchResults('', resultsContainer);
      }
    };

    const closeSearch = () => {
      modal.classList.remove('active');
    };

    trigger.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) closeSearch();
        else openSearch();
      } else if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeSearch();
      }
    });

    if (input && resultsContainer) {
      input.addEventListener('input', (e) => {
        this.renderSearchResults(e.target.value.toLowerCase().trim(), resultsContainer);
      });
    }
  },

  renderSearchResults(query, container) {
    if (!container) return;

    if (!query) {
      container.innerHTML = `
        <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          Type to search guides (e.g. "cyclone", "fire", "water", "112", "first aid")...
        </div>
      `;
      return;
    }

    const matches = [];

    // Search disaster titles & checklist items
    Object.keys(DISASTER_DATA).forEach(key => {
      const d = DISASTER_DATA[key];
      if (d.titleEn.toLowerCase().includes(query) || d.contextEn.toLowerCase().includes(query)) {
        matches.push({
          type: 'Disaster Guide',
          title: d.titleEn,
          desc: d.contextEn,
          action: () => {
            PreparednessSystem.currentCategory = key;
            PreparednessSystem.renderCategoryTabs();
            PreparednessSystem.renderActiveDisasterGuide(key);
            window.location.hash = '#preparedness';
          }
        });
      }

      ['before', 'during', 'after'].forEach(phase => {
        d.checklists[phase].forEach(item => {
          if (item.textEn.toLowerCase().includes(query)) {
            matches.push({
              type: `Checklist (${d.titleEn})`,
              title: item.textEn,
              desc: `Phase: ${phase.toUpperCase()}`,
              action: () => {
                PreparednessSystem.currentCategory = key;
                PreparednessSystem.renderCategoryTabs();
                PreparednessSystem.renderActiveDisasterGuide(key);
                window.location.hash = '#preparedness';
              }
            });
          }
        });
      });
    });

    // Search Helplines
    OFFICIAL_HELPLINES.forEach(h => {
      if (h.name.toLowerCase().includes(query) || h.number.includes(query) || h.purpose.toLowerCase().includes(query)) {
        matches.push({
          type: 'Emergency Helpline',
          title: `${h.number} — ${h.name}`,
          desc: h.purpose,
          action: () => {
            window.location.hash = '#emergency';
          }
        });
      }
    });

    if (matches.length === 0) {
      container.innerHTML = `
        <div style="padding:2rem; text-align:center; color:var(--text-muted); font-size:0.88rem;">
          No matching preparedness instructions found for "${this.escapeHtml(query)}".
        </div>
      `;
      return;
    }

    container.innerHTML = matches.slice(0, 8).map((m, idx) => `
      <div class="search-result-item" data-idx="${idx}" style="padding:0.75rem 1rem; border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer; transition:background 0.15s ease;">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.2rem;">
          <span class="badge badge-cyan" style="font-size:0.65rem;">${m.type}</span>
          <span style="font-weight:600; color:#FFFFFF; font-size:0.88rem;">${this.escapeHtml(m.title)}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.3;">
          ${this.escapeHtml(m.desc)}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.style.background = 'rgba(0, 229, 255, 0.08)');
      item.addEventListener('mouseleave', () => item.style.background = 'transparent');
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-idx'), 10);
        if (matches[idx]) {
          matches[idx].action();
          document.getElementById('modal-quick-search')?.classList.remove('active');
        }
      });
    });
  },

  setupSettingsView() {
    const settings = Storage.getSettings();

    // High Contrast Toggle
    const hcToggle = document.getElementById('setting-high-contrast');
    if (hcToggle) {
      hcToggle.checked = Boolean(settings.highContrast);
      if (settings.highContrast) document.body.classList.add('high-contrast');

      hcToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        Storage.saveSettings({ highContrast: enabled });
        if (enabled) document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');
      });
    }

    // Reduced Motion Toggle
    const rmToggle = document.getElementById('setting-reduced-motion');
    if (rmToggle) {
      rmToggle.checked = Boolean(settings.reducedMotion);
      if (settings.reducedMotion) document.body.classList.add('reduced-motion');

      rmToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        Storage.saveSettings({ reducedMotion: enabled });
        if (enabled) document.body.classList.add('reduced-motion');
        else document.body.classList.remove('reduced-motion');
      });
    }

    // Voice Speed Select
    const vsSelect = document.getElementById('setting-voice-speed');
    if (vsSelect) {
      vsSelect.value = String(settings.voiceSpeed || 1.0);
      vsSelect.addEventListener('change', (e) => {
        const speed = parseFloat(e.target.value);
        Storage.saveSettings({ voiceSpeed: speed });
      });
    }

    // Language Select
    const langSelect = document.getElementById('setting-language-select');
    if (langSelect) {
      langSelect.value = getLanguage();
      langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }

    // Header Language Toggle Button
    const headerLangBtn = document.getElementById('btn-lang-toggle');
    if (headerLangBtn) {
      headerLangBtn.addEventListener('click', () => {
        const nextLang = getLanguage() === 'en' ? 'bn' : 'en';
        setLanguage(nextLang);
        if (langSelect) langSelect.value = nextLang;
      });
    }

    // Clear Storage Button
    const clearBtn = document.getElementById('btn-clear-all-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm(t('clearDataConfirm'))) {
          Storage.clearAllData();
          window.dispatchEvent(new CustomEvent('reliefos:toast', {
            detail: { title: 'Storage Reset', message: t('storageClearedToast'), type: 'info' }
          }));
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    }
  },

  setupAnalyzer() {
    const form = document.getElementById('form-readiness-analyzer');
    if (!form) return;

    // Load saved analyzer state if any
    const saved = Storage.getAnalyzerState();
    if (saved && saved.answers) {
      Object.keys(saved.answers).forEach(qKey => {
        const radio = form.querySelector(`input[name="${qKey}"][value="${saved.answers[qKey]}"]`);
        if (radio) radio.checked = true;
      });
      this.renderAnalyzerResults(saved.score, saved.unmetQuestions);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const answers = {};
      let totalQuestions = 0;
      let yesCount = 0;
      const unmetQuestions = [];

      const questionsMeta = [
        { key: 'q1', text: 'Official 112 Emergency Number Knowledge', weight: 15 },
        { key: 'q2', text: 'Family Evacuation & Meeting Plan', weight: 15 },
        { key: 'q3', text: 'Waterproof Document Pouches (Aadhaar/Deeds)', weight: 10 },
        { key: 'q4', text: '72-Hour Emergency Survival Kit Packed', weight: 20 },
        { key: 'q5', text: 'Nearest Cyclone/Flood Shelter Identified', weight: 15 },
        { key: 'q6', text: 'LPG Gas & Electrical Main Breaker Shutoff Known', weight: 15 },
        { key: 'q7', text: 'First Aid Kit & Critical Medicines Stocked', weight: 10 }
      ];

      let earnedPoints = 0;
      let maxPoints = 0;

      questionsMeta.forEach(q => {
        maxPoints += q.weight;
        const val = formData.get(q.key);
        answers[q.key] = val;
        if (val === 'yes') {
          earnedPoints += q.weight;
        } else {
          unmetQuestions.push(q.text);
        }
      });

      const finalScore = Math.round((earnedPoints / maxPoints) * 100);

      Storage.saveAnalyzerState({
        score: finalScore,
        answers,
        unmetQuestions,
        timestamp: Date.now()
      });

      this.renderAnalyzerResults(finalScore, unmetQuestions);

      window.dispatchEvent(new CustomEvent('reliefos:checklist-updated'));
      window.dispatchEvent(new CustomEvent('reliefos:toast', {
        detail: {
          title: 'Readiness Analyzed',
          message: `Calculated safety score: ${finalScore}%. Check recommendations below.`,
          type: 'success'
        }
      }));
    });
  },

  renderAnalyzerResults(score, unmetQuestions) {
    const container = document.getElementById('analyzer-results-panel');
    if (!container) return;

    container.style.display = 'block';

    const scoreValEl = document.getElementById('analyzer-score-val');
    const levelBadgeEl = document.getElementById('analyzer-level-badge');
    const fillEl = document.getElementById('analyzer-score-fill');
    const recsListEl = document.getElementById('analyzer-recommendations-list');

    if (scoreValEl) scoreValEl.textContent = `${score}%`;

    if (fillEl) {
      fillEl.style.width = `${score}%`;
      if (score < 40) fillEl.style.background = 'var(--status-danger)';
      else if (score < 75) fillEl.style.background = 'var(--status-warning)';
      else fillEl.style.background = 'var(--status-safe)';
    }

    if (levelBadgeEl) {
      if (score < 40) {
        levelBadgeEl.textContent = t('levelCritical');
        levelBadgeEl.className = 'badge badge-red';
      } else if (score < 75) {
        levelBadgeEl.textContent = t('levelModerate');
        levelBadgeEl.className = 'badge badge-demo';
      } else {
        levelBadgeEl.textContent = t('levelOptimal');
        levelBadgeEl.className = 'badge badge-verified';
      }
    }

    if (recsListEl) {
      if (unmetQuestions.length === 0) {
        recsListEl.innerHTML = `
          <div style="color:var(--status-safe); font-size:0.9rem; padding:0.5rem 0;">
            ✓ Outstanding! All core disaster preparedness standards are met. Keep emergency kits refreshed every 6 months.
          </div>
        `;
      } else {
        recsListEl.innerHTML = unmetQuestions.map(q => `
          <li style="margin-bottom:0.6rem; color:var(--text-secondary); font-size:0.88rem;">
            <strong style="color:#FFFFFF;">Action Required:</strong> ${this.escapeHtml(q)}
          </li>
        `).join('');
      }
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
};
