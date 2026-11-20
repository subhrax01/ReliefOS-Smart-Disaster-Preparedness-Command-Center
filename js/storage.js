/* ==========================================================================
   ReliefOS — Resilient Local Storage Manager
   Handles client-side persistence for checklists, contacts, settings, drafts & logs.
   ========================================================================== */

const STORAGE_KEYS = {
  SETTINGS: 'reliefos_settings',
  LOCATION: 'reliefos_location',
  CHECKLISTS: 'reliefos_checklists',
  CONTACTS: 'reliefos_contacts',
  REPORTS: 'reliefos_reports',
  ANALYZER: 'reliefos_analyzer',
  ACTIVITY: 'reliefos_activity'
};

const DEFAULT_SETTINGS = {
  lang: 'en',
  highContrast: false,
  reducedMotion: false,
  soundFx: false,
  voiceSpeed: 1.0
};

const DEFAULT_CONTACTS = [
  {
    id: 'cnt-wb-disaster-1070',
    name: 'WB State Disaster Management Helpline',
    relationship: 'State Emergency Authority',
    phone: '1070',
    notes: 'Toll-free 24x7 Control Room, Nabanna, West Bengal',
    isOfficial: true,
    timestamp: Date.now()
  },
  {
    id: 'cnt-kolkata-police-100',
    name: 'Police Emergency Assistance',
    relationship: 'Law Enforcement',
    phone: '100',
    notes: 'Universal Police Control Room',
    isOfficial: true,
    timestamp: Date.now()
  },
  {
    id: 'cnt-ambulance-108',
    name: 'National Ambulance Service',
    relationship: 'Medical Emergency',
    phone: '108',
    notes: 'Emergency medical transit & life support dispatch',
    isOfficial: true,
    timestamp: Date.now()
  }
];

export const Storage = {
  // Safe generic retrieval
  getItem(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`[ReliefOS Storage] Read error for key "${key}":`, e);
      return fallback;
    }
  },

  // Safe generic save
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[ReliefOS Storage] Write error for key "${key}":`, e);
      return false;
    }
  },

  // Settings
  getSettings() {
    const saved = this.getItem(STORAGE_KEYS.SETTINGS, {});
    return { ...DEFAULT_SETTINGS, ...saved };
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    this.setItem(STORAGE_KEYS.SETTINGS, merged);
    return merged;
  },

  // Location
  getLocation() {
    return this.getItem(STORAGE_KEYS.LOCATION, {
      lat: 22.5726,
      lon: 88.3639,
      name: 'Kolkata, West Bengal (Default Demo)',
      isManual: true,
      accuracy: null,
      timestamp: Date.now()
    });
  },

  saveLocation(locationData) {
    this.setItem(STORAGE_KEYS.LOCATION, locationData);
    this.logActivity(`Location set: ${locationData.name}`, 'location');
    return locationData;
  },

  // Checklists
  getChecklists() {
    return this.getItem(STORAGE_KEYS.CHECKLISTS, {});
  },

  isChecklistItemCompleted(disasterKey, phase, itemId) {
    const data = this.getChecklists();
    return Boolean(data[disasterKey]?.[phase]?.[itemId]);
  },

  toggleChecklistItem(disasterKey, phase, itemId) {
    const data = this.getChecklists();
    if (!data[disasterKey]) data[disasterKey] = {};
    if (!data[disasterKey][phase]) data[disasterKey][phase] = {};

    const currentState = Boolean(data[disasterKey][phase][itemId]);
    data[disasterKey][phase][itemId] = !currentState;
    this.setItem(STORAGE_KEYS.CHECKLISTS, data);

    const statusWord = !currentState ? 'Completed' : 'Unchecked';
    this.logActivity(`${statusWord} checklist item in ${disasterKey.toUpperCase()} (${phase})`, 'checklist');
    return !currentState;
  },

  // Emergency Contacts
  getContacts() {
    const contacts = this.getItem(STORAGE_KEYS.CONTACTS, null);
    if (!contacts || contacts.length === 0) {
      this.setItem(STORAGE_KEYS.CONTACTS, DEFAULT_CONTACTS);
      return DEFAULT_CONTACTS;
    }
    return contacts;
  },

  saveContact(contact) {
    const contacts = this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contact.id);

    if (existingIndex >= 0) {
      contacts[existingIndex] = { ...contacts[existingIndex], ...contact };
    } else {
      contact.id = contact.id || `contact-${Date.now()}`;
      contact.timestamp = Date.now();
      contacts.push(contact);
    }

    this.setItem(STORAGE_KEYS.CONTACTS, contacts);
    this.logActivity(`Emergency Contact saved: ${contact.name}`, 'contact');
    return contacts;
  },

  deleteContact(id) {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    this.setItem(STORAGE_KEYS.CONTACTS, filtered);
    this.logActivity(`Removed contact entry: ${id}`, 'contact');
    return filtered;
  },

  // Community Hazard Reports (Local Drafts)
  getReports() {
    return this.getItem(STORAGE_KEYS.REPORTS, []);
  },

  saveReport(report) {
    const reports = this.getReports();
    report.id = report.id || `draft-${Date.now()}`;
    report.timestamp = report.timestamp || Date.now();
    report.status = 'Local Draft — Not Submitted';
    reports.unshift(report);
    this.setItem(STORAGE_KEYS.REPORTS, reports);
    this.logActivity(`Created local report draft: ${report.type}`, 'report');
    return report;
  },

  deleteReport(id) {
    const reports = this.getReports();
    const filtered = reports.filter(r => r.id !== id);
    this.setItem(STORAGE_KEYS.REPORTS, filtered);
    this.logActivity(`Deleted draft report: ${id}`, 'report');
    return filtered;
  },

  // Preparedness Readiness Analyzer
  getAnalyzerState() {
    return this.getItem(STORAGE_KEYS.ANALYZER, null);
  },

  saveAnalyzerState(state) {
    this.setItem(STORAGE_KEYS.ANALYZER, state);
    this.logActivity(`Calculated Preparedness Score: ${state.score}%`, 'analyzer');
    return state;
  },

  // Audit Activity Log
  getActivityLog() {
    return this.getItem(STORAGE_KEYS.ACTIVITY, [
      {
        id: 'act-init',
        text: 'ReliefOS Command Shell Initialized (Nominal)',
        type: 'system',
        timestamp: Date.now()
      }
    ]);
  },

  logActivity(text, type = 'info') {
    const list = this.getActivityLog();
    list.unshift({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      type,
      timestamp: Date.now()
    });
    // Keep max 30 items
    if (list.length > 30) list.pop();
    this.setItem(STORAGE_KEYS.ACTIVITY, list);
    // Dispatch event so dashboard updates in real time
    window.dispatchEvent(new CustomEvent('reliefos:activity-updated'));
  },

  // Reset all local data
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.error('[ReliefOS Storage] Failed to clear local data:', e);
      return false;
    }
  }
};
