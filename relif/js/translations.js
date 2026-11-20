/* ==========================================================================
   ReliefOS — Multilingual Localization Matrix
   Supports English (en) and Authentic West Bengal Bengali (বাংলা - bn).
   ========================================================================== */

import { Storage } from './storage.js';

export const Translations = {
  en: {
    // Brand & Header
    appName: "ReliefOS",
    tagline: "When Every Second Matters.",
    systemNominal: "SYSTEM NOMINAL // STANDBY",
    offlineNotice: "OFFLINE READY // CACHED",
    onlineNotice: "LIVE NETWORK CONNECTED",
    quickSearch: "Quick Search",
    searchPlaceholder: "Search disaster guides, helplines, or procedures...",
    callEmergency: "CALL 112",
    callEmergencyFull: "CALL EMERGENCY SERVICES (112)",
    confirmCallTitle: "EMERGENCY DIAL CONFIRMATION",
    confirmCallDesc: "You are about to launch your device dialer for 112 (India Universal Emergency). Do you wish to continue?",
    confirmDialBtn: "Proceed to Call 112",
    cancelBtn: "Cancel",

    // Navigation
    navDashboard: "Command Dashboard",
    navPreparedness: "Disaster Guides",
    navEmergency: "Emergency Assistance",
    navLocation: "Smart Location",
    navAnalyzer: "Readiness Analyzer",
    navReports: "Community Reports",
    navSettings: "Settings & System",

    // Dashboard
    dashTelemetryTitle: "Operational Command Telemetry",
    dashReadinessTitle: "Preparedness Readiness Index",
    dashReadinessSub: "Dynamic score based on completed emergency checklists & analyzer.",
    dashRadarTitle: "Tactical Hazard Radar",
    dashRadarNotice: "SIMULATED SENSOR GRID — DEMONSTRATION PURPOSES ONLY",
    dashDisastersOverview: "High-Priority Disaster Profiles",
    dashActivityTitle: "Local Activity & Audit Stream",
    dashNoActivity: "No recent local actions recorded.",
    dashQuickTips: "Immediate Action Guidelines",

    // Disasters
    disasterCyclone: "Cyclone & Storm Surge",
    disasterFlood: "Monsoon & Urban Flood",
    disasterEarthquake: "Seismic Activity (Zone III/IV)",
    disasterHeatwave: "Severe Summer Heatwave",
    disasterFire: "Urban & High-Rise Fire",

    phaseBefore: "Before (Preparedness)",
    phaseDuring: "During (Active Hazard)",
    phaseAfter: "After (Safe Recovery)",

    readAloudBtn: "Read Guide Aloud",
    stopAudioBtn: "Stop Speech",

    // Emergency View
    emergencyViewTitle: "Emergency Assistance Center",
    emergencyViewDesc: "Direct dial access to India's official emergency dispatch networks and your encrypted local personal contacts.",
    emergencyDisclaimer: "DISCLAIMER: ReliefOS is an independent civic preparedness tool. It does not automatically contact emergency responders, dispatch rescue services, or monitor live incidents.",
    officialHelplines: "Official Indian & West Bengal Helplines",
    personalContacts: "Personal Emergency Contacts (Local Storage)",
    addContactBtn: "+ Add Personal Contact",
    contactName: "Full Name",
    contactRelation: "Relationship / Role",
    contactPhone: "Phone Number",
    contactNotes: "Medical / Location Notes",
    saveContactBtn: "Save Contact",

    // Location View
    locationViewTitle: "Smart Geolocation & Grid Pin",
    locationViewDesc: "Permission-based browser geolocation. Coordinates are processed strictly in your browser and never uploaded.",
    requestLocationBtn: "Detect Current GPS Coordinates",
    copyCoordsBtn: "Copy Coordinates",
    coordsCopiedToast: "GPS coordinates copied to clipboard!",
    openMapBtn: "Open in Satellite Map",
    manualLocationTitle: "Manual West Bengal District Selection",
    selectDistrict: "Select District...",
    gpsAccuracy: "Accuracy",
    gpsTimestamp: "Last Timestamp",
    mapDisclaimer: "DEMONSTRATION TACTICAL GRID: Map visualizations use local vector simulation. No tracking data is sent to external servers.",

    // Readiness Analyzer
    analyzerTitle: "Preparedness Readiness Analyzer",
    analyzerDesc: "Evaluate your household's safety readiness with this rule-based questionnaire.",
    analyzerDisclaimer: "EDUCATIONAL TOOL ONLY: This assessment provides general guidance and does not guarantee real-world survival or hazard immunity.",
    calculateScoreBtn: "Calculate My Readiness Score",
    scoreResultTitle: "Your Safety Readiness Assessment",
    levelCritical: "Critical Preparedness Gap",
    levelModerate: "Moderate Readiness",
    levelOptimal: "High Operational Readiness",
    recommendationsTitle: "Prioritized Recommendations",

    // Community Reports
    reportsTitle: "Community Incident Reporting Demo",
    reportsDesc: "Demonstration tool for documenting localized hazards. All entries remain strictly local in your browser storage.",
    reportDisclaimer: "LOCAL DRAFT NOTICE: Reports submitted here are stored locally on your device for demo purposes. They are NOT sent to municipal or disaster authorities.",
    newReportBtn: "+ Create Incident Draft",
    reportType: "Incident Category",
    reportSeverity: "Estimated Severity",
    reportLocation: "Landmark / Location",
    reportDescription: "Detailed Observations",
    reportImage: "Attach Photo Proof (Local Preview)",
    saveReportDraftBtn: "Save Local Draft",
    filterAll: "All Categories",
    noReportsFound: "No local draft reports found.",
    statusDraft: "Local Draft — Not Submitted",
    deleteReportConfirm: "Are you sure you want to delete this local draft?",

    // Settings
    settingsTitle: "System Configuration & Preferences",
    settingsLanguage: "Interface Language",
    settingsHighContrast: "High-Contrast Accessibility Mode",
    settingsReducedMotion: "Reduced Motion (Disable non-critical effects)",
    settingsSoundFx: "Auditory Audio Feedback",
    settingsVoiceSpeed: "Voice Assistance Speaking Rate",
    settingsStorageTitle: "Local Browser Storage Management",
    clearDataBtn: "Purge All Locally Stored Data",
    clearDataConfirm: "WARNING: This will delete all your local checklists, saved emergency contacts, and draft reports from this device. Proceed?",
    storageClearedToast: "All local ReliefOS data has been reset.",

    // Universal
    closeModal: "Close",
    loading: "Loading telemetry...",
    demoBadge: "DEMO SIMULATION",
    verifiedBadge: "OFFICIAL HELPLINE",
    officialSourcesTitle: "Authoritative Indian Disaster Resources"
  },

  bn: {
    // Brand & Header
    appName: "ReliefOS (রিলিফ-ওএস)",
    tagline: "যখন প্রতিটি সেকেন্ড অত্যন্ত মূল্যবান।",
    systemNominal: "সিস্টেম সক্রিয় // প্রস্তুত অবস্থা",
    offlineNotice: "অফলাইন প্রস্তুত // সংরক্ষিত",
    onlineNotice: "লাইভ নেটওয়ার্ক সংযুক্ত",
    quickSearch: "দ্রুত অনুসন্ধান",
    searchPlaceholder: "দুর্যোগ গাইড, হেল্পলাইন বা নির্দেশিকা খুঁজুন...",
    callEmergency: "ডায়াল ১১২",
    callEmergencyFull: "জরুরি সেবায় কল করুন (১১২)",
    confirmCallTitle: "জরুরি কল নিশ্চিতকরণ",
    confirmCallDesc: "আপনি ১১২ (ভারতের সার্বজনীন জরুরি নম্বর) ডায়াল করতে যাচ্ছেন। আপনি কি এগিয়ে যেতে চান?",
    confirmDialBtn: "১১২ নম্বরে কল করুন",
    cancelBtn: "বাতিল করুন",

    // Navigation
    navDashboard: "কমান্ড ড্যাশবোর্ড",
    navPreparedness: "দুর্যোগ প্রস্তুতি গাইড",
    navEmergency: "জরুরি সহায়তা কেন্দ্র",
    navLocation: "স্মার্ট অবস্থান",
    navAnalyzer: "প্রস্তুতি সূচক পরীক্ষক",
    navReports: "কমিউনিটি রিপোর্ট",
    navSettings: "সেটিংস ও সিস্টেম",

    // Dashboard
    dashTelemetryTitle: "অপারেশনাল কমান্ড টেলিমেট্রি",
    dashReadinessTitle: "সুরক্ষা প্রস্তুতি সূচক",
    dashReadinessSub: "সম্পূর্ণ চেকপ্রস্তুতি ও মূল্যায়নের ওপর ভিত্তি করে নির্ণীত স্কোর।",
    dashRadarTitle: "কৌশলগত দুর্যোগ রাডার",
    dashRadarNotice: "সিমুলেটেড সেন্সর গ্রিড — শুধুমাত্র প্রদর্শনীর উদ্দেশ্যে",
    dashDisastersOverview: "অগ্রাধিকারভিত্তিক দুর্যোগ নির্দেশিকা",
    dashActivityTitle: "স্থানীয় ক্রিয়াকলাপের বিবরণ",
    dashNoActivity: "এখনও কোনো সাম্প্রতিক ক্রিয়াকলাপ নথিবদ্ধ হয়নি।",
    dashQuickTips: "জরুরি তাৎক্ষণিক পদক্ষেপ",

    // Disasters
    disasterCyclone: "ঘূর্ণিঝড় ও জলোচ্ছ্বাস",
    disasterFlood: "বন্যা ও অতিরিক্ত বৃষ্টিপাত",
    disasterEarthquake: "ভূমিকম্প (জোন ৩/৪)",
    disasterHeatwave: "তীব্র তাপপ্রবাহ (দাবদাহ)",
    disasterFire: "অগ্নিকাণ্ড ও শর্ট-সার্কিট",

    phaseBefore: "পূর্ব প্রস্তুতি (বিপদ আসার আগে)",
    phaseDuring: "দুর্যোগ চলাকালীন নিরাপত্তা",
    phaseAfter: "পরবর্তী পদক্ষেপ ও পুনরুদ্ধার",

    readAloudBtn: "নির্দেশিকা শুনুন (ভয়েস)",
    stopAudioBtn: "ভয়েস বন্ধ করুন",

    // Emergency View
    emergencyViewTitle: "জরুরি সহায়তা কেন্দ্র",
    emergencyViewDesc: "ভারতের জাতীয় জরুরি রেসপন্স সিস্টেম ১১২ এবং আপনার নিজস্ব পরিচিতদের সাথে দ্রুত যোগাযোগের ব্যবস্থা।",
    emergencyDisclaimer: "সতর্কবার্তা: ReliefOS একটি স্বাধীন নাগরিক প্রস্তুতিমূলক ব্যবস্থা। এটি নিজে থেকে কোনো উদ্ধারকারী দল পাঠায় না বা জরুরি বার্তা প্রেরণ করে না।",
    officialHelplines: "সরকারি গুরুত্বপূর্ণ হেল্পলাইন (পশ্চিমবঙ্গ ও ভারত)",
    personalContacts: "ব্যক্তিগত জরুরি যোগাযোগ (আপনার ডিভাইসে সংরক্ষিত)",
    addContactBtn: "+ নতুন পরিচিত ব্যক্তি যোগ করুন",
    contactName: "সম্পূর্ণ নাম",
    contactRelation: "সম্পর্ক বা ভূমিকা",
    contactPhone: "ফোন নম্বর",
    contactNotes: "চিকিৎসা বা বাসস্থান সংক্রান্ত নোট",
    saveContactBtn: "সংরক্ষণ করুন",

    // Location View
    locationViewTitle: "স্মার্ট অবস্থান নির্ধারণ",
    locationViewDesc: "ব্রাউজারের অনুমতিভিত্তিক ভৌগোলিক স্থানাঙ্ক। আপনার অবস্থান কোনো সার্ভারে পাঠানো হয় না, সম্পূর্ণ ডিভাইসে প্রক্রিয়াকৃত।",
    requestLocationBtn: "জিপিএস অবস্থান শনাক্ত করুন",
    copyCoordsBtn: "স্থানাঙ্ক কপি করুন",
    coordsCopiedToast: "জিপিএস স্থানাঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!",
    openMapBtn: "মানচিত্রে অবস্থান দেখুন",
    manualLocationTitle: "পশ্চিমবঙ্গের জেলা নির্বাচন",
    selectDistrict: "জেলা নির্বাচন করুন...",
    gpsAccuracy: "নির্ভুলতা",
    gpsTimestamp: "সর্বশেষ সময়",
    mapDisclaimer: "প্রদর্শনী গ্রিড: মানচিত্রের তথ্য স্থানীয় সিমুলেশন। কোনো ট্র্যাকিং ডাটা সার্ভারে আপলোড করা হয় না।",

    // Readiness Analyzer
    analyzerTitle: "প্রস্তুতি সূচক মূল্যায়নকারী",
    analyzerDesc: "একটি নিয়মভিত্তিক প্রশ্নাবলীর মাধ্যমে আপনার পরিবারের দুর্যোগ প্রস্তুতি যাচাই করুন।",
    analyzerDisclaimer: "শুধুমাত্র শিক্ষামূলক উদ্দেশ্য: এই মূল্যায়ন সাধারণ সচেতনতার জন্য এবং বাস্তব সুরক্ষার কোনো আইনি গ্যারান্টি প্রদান করে না।",
    calculateScoreBtn: "প্রস্তুতি স্কোর গণনা করুন",
    scoreResultTitle: "আপনার সুরক্ষা প্রস্তুতি মূল্যায়ন",
    levelCritical: "জরুরি প্রস্তুতি অত্যন্ত কম",
    levelModerate: "মধ্যম প্রস্তুতি সম্পন্ন",
    levelOptimal: "উচ্চতর নিরাপত্তা প্রস্তুত",
    recommendationsTitle: "জরুরি করণীয় সুপারিশসমূহ",

    // Community Reports
    reportsTitle: "কমিউনিটি রিপোর্ট ডেমো",
    reportsDesc: "এলাকার রাস্তা জলমগ্ন বা বিপদগ্রস্ত পরিকাঠামো নথিভুক্ত করার নমুনা ব্যবস্থা। সমস্ত তথ্য কেবল আপনার ব্রাউজারেই সংরক্ষিত থাকে।",
    reportDisclaimer: "স্থানীয় খসড়া নোটিশ: এখানে তৈরি রিপোর্ট শুধুমাত্র আপনার ডিভাইসেই সংরক্ষিত থাকে। এটি কোনো পৌরসভা বা দুর্যোগ ব্যবস্থাপনা দপ্তরে পাঠানো হয় না।",
    newReportBtn: "+ নতুন ঘটনার খসড়া লিখুন",
    reportType: "ঘটনার ধরন",
    reportSeverity: "সম্ভাব্য তীব্রতা",
    reportLocation: "স্থান বা ল্যান্ডমার্ক",
    reportDescription: "বিবরণ",
    reportImage: "ছবির প্রমাণ যোগ করুন (লোকাল প্রিভিউ)",
    saveReportDraftBtn: "খসড়া সংরক্ষণ করুন",
    filterAll: "সকল বিভাগ",
    noReportsFound: "কোনো স্থানীয় খসড়া রিপোর্ট পাওয়া যায়নি।",
    statusDraft: "স্থানীয় খসড়া — প্রেরিত নয়",
    deleteReportConfirm: "আপনি কি নিশ্চিতভাবে এই খসড়াটি মুছে ফেলতে চান?",

    // Settings
    settingsTitle: "সিস্টেম সেটিংস ও পছন্দসমূহ",
    settingsLanguage: "ভাষা নির্বাচন",
    settingsHighContrast: "হাই-কনট্রাস্ট মোড (উচ্চ দৃশ্যমানতা)",
    settingsReducedMotion: "অ্যানিমেশন সীমিতকরণ (Reduced Motion)",
    settingsSoundFx: "অডিও ফিডব্যাক",
    settingsVoiceSpeed: "ভয়েস পড়ার গতি",
    settingsStorageTitle: "ব্রাউজার লোকাল স্টোরেজ পরিচালনা",
    clearDataBtn: "সমস্ত সংরক্ষিত স্থানীয় ডাটা মুছে ফেলুন",
    clearDataConfirm: "সতর্কতা: এটি আপনার সংরক্ষিত সমস্ত চেকলিস্ট, ব্যক্তিগত যোগাযোগ এবং রিপোর্টের খসড়া মুছে দেবে। আপনি কি এগিয়ে যেতে চান?",
    storageClearedToast: "সমস্ত লোকাল ডাটা সফলভাবে মুছে ফেলা হয়েছে।",

    // Universal
    closeModal: "বন্ধ করুন",
    loading: "টেলিমেট্রি লোড হচ্ছে...",
    demoBadge: "নমুনা প্রদর্শন",
    verifiedBadge: "সরকারি হেল্পলাইন",
    officialSourcesTitle: "সরকারি প্রামাণ্য দুর্যোগ তথ্যসূত্র"
  }
};

let currentLanguage = 'en';

export function initLanguage() {
  const settings = Storage.getSettings();
  currentLanguage = settings.lang || 'en';
  document.documentElement.lang = currentLanguage;
  applyTranslations();
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (Translations[lang]) {
    currentLanguage = lang;
    Storage.saveSettings({ lang });
    document.documentElement.lang = lang;
    applyTranslations();
    window.dispatchEvent(new CustomEvent('reliefos:language-changed', { detail: { lang } }));
  }
}

export function t(key) {
  const dict = Translations[currentLanguage] || Translations.en;
  return dict[key] || Translations.en[key] || key;
}

export function applyTranslations() {
  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });

  // Translate placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update lang button text in header
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    const flagSpan = langBtn.querySelector('.lang-label');
    if (flagSpan) {
      flagSpan.textContent = currentLanguage === 'en' ? 'বাংলা' : 'EN';
    }
  }
}
