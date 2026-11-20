# ReliefOS — "When Every Second Matters."

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%2F%20PWA-00E5FF)](https://reliefos-command-center-subhranil.netlify.app)
[![Live Demo](https://img.shields.io/badge/Production-Live%20on%20Netlify-00E676?style=for-the-badge&logo=netlify)](https://reliefos-command-center-subhranil.netlify.app)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20ES6+-00E676)](https://developer.mozilla.org/)
[![Target Region](https://img.shields.io/badge/Primary%20Focus-India%20%26%20West%20Bengal-FF9100)](https://wbdmd.gov.in/)

> **A futuristic dark-mode civic disaster preparedness and emergency command web application built for India, with special attention to West Bengal's coastal, delta, and seismic hazard profiles.**

🌐 **Live Production URL:** [https://reliefos-command-center-subhranil.netlify.app](https://reliefos-command-center-subhranil.netlify.app)

---

## 🌟 Executive Overview

**ReliefOS** is a zero-dependency, frontend-only emergency command center prototype engineered to demonstrate how modern, accessible, and high-performance civic technology can look and function in the year 2035.

Conceived with a design aesthetic inspired by **NASA Mission Control crossed with a next-generation humanitarian response platform**, ReliefOS operates completely in the client-side sandbox. It delivers life-critical preparedness checklists, regional emergency directories, browser speech synthesis, permission-based geolocation telemetry, and community incident draft logging—even under complete network blackouts via Service Worker caching.

---

## 🛰️ Visual Identity & Design System (Year 2035)

- **Color Palette:**
  - **Midnight Base:** `#050814` & `#070D1E` (Deep Space Midnight)
  - **Primary Electric Cyan:** `#00E5FF` (Luminous HUD glow)
  - **Safe Status Emerald:** `#00E676` (System Nominal & completed states)
  - **Preparedness Amber:** `#FFB300` & `#FF9100` (Warnings & caution notices)
  - **Emergency Red:** `#FF1744` (Critical SOS dialer actions)
- **Glassmorphism Panels:** Frosted backdrop blurs (`backdrop-filter: blur(16px)`), sub-pixel neon borders, and HUD-inspired corner brackets.
- **Animated Tactical Radar:** Native HTML5 canvas visualizer featuring continuous 360-degree beam sweeps, range circles, bearing markers, and simulated sensor pings.
- **Accessibility & Performance:** Zero CSS or JS frameworks, WCAG AAA compliant text contrast, dedicated High-Contrast mode, and full `@media (prefers-reduced-motion: reduce)` support.

---

## ⚡ Core Features & Functional Architecture

### 1. Futuristic Intro Experience
- HUD system initialization sequence with animated scanning lines and telemetry status logs.
- Automatic transition in ~1.3 seconds or instant bypass via `[ Skip Intro // ESC ]`.

### 2. Main Operational Command Dashboard
- **Dynamic Live Clock:** Real-time Indian Standard Time (IST) clock with date and day readouts.
- **Tactical Hazard Radar:** 360° sweeping canvas beam with simulated beacon contacts (clearly labeled as demonstration data).
- **Preparedness Readiness Index:** Real-time SVG circular progress gauge reflecting weighted progress across completed checklists and analyzer survey.
- **Browser Connectivity Monitor:** Reactive status pill indicating live network or offline cached mode.
- **Local Activity Stream:** Real-time audit log of user actions (saved contacts, completed checklists, new reports).

### 3. Disaster Preparedness Center (West Bengal Context)
Dedicated interactive survival interfaces for 5 high-priority regional hazards:
1. **Cyclones & Storm Surges:** Tailored for Bay of Bengal coastal delta zones (Sundarbans, Digha, Sagar Island). Focus on Multipurpose Cyclone Shelters (MPCS), emergency bags, and calm eye-of-the-storm cautions.
2. **Monsoon & Riverine Floods:** Gangetic floodplains, Damodar Valley, Teesta/Torsa basins. Covers electrical breaker shutdowns, water purification, and snake encounter warnings.
3. **Earthquakes & Seismic Shocks:** Seismic Zone III (Kolkata/South Bengal) and Zone IV/V (Darjeeling/Jalpaiguri). Step-by-step **Drop, Cover, and Hold On** drill guides and utility shutoff procedures.
4. **Severe Summer Heatwaves:** Western districts (Bankura, Purulia, Jhargram) exceeding 43°C and South Bengal wet-bulb index. Covers ORS hydration schedules and heat stroke recognition.
5. **Urban High-Rise Fires:** Dense settlements across Kolkata and Howrah. Covers smoke crawling, the **P.A.S.S.** fire extinguisher method, and emergency stairwell protocols.

*Features in every guide:*
- **Interactive Checklists:** Multi-phase (Before, During, After) checklists persisting automatically in `localStorage`.
- **Life-Safety Caution Boxes:** Prominent warnings to prevent fatalities.
- **Official Government Portals:** Direct links to NDMA (`ndma.gov.in`), IMD (`mausam.imd.gov.in`), and WB Disaster Management (`wbdmd.gov.in`).

### 4. Emergency Assistance Center & Contact Manager
- **Emergency 112 Action:** High-urgency trigger button leading to a confirmation modal before launching the device's native telephone dialer (`tel:112`).
- **Official Helpline Directory:** Pre-loaded toll-free numbers for India and West Bengal:
  - `112` (Universal Emergency - Police, Fire, Ambulance)
  - `1070` (West Bengal State Disaster Control Room, Nabanna)
  - `1077` (District Disaster Control Room / DDMA)
  - `101` (Fire & Rescue Services)
  - `108` (Emergency Ambulance Service)
  - `100` (Police Control Room)
  - `1091` (Women Emergency Helpline)
  - `1098` (National Childline Emergency)
- **Personal Contact Manager:** Users can add, view, dial, and remove personal emergency contacts (Name, Relationship, Phone, Medical/Location Notes) stored strictly in `localStorage`.

### 5. Smart Location & Tactical Vector Reticle
- **Permission-Based GPS:** Detects coordinates (`latitude`, `longitude`, `accuracy`) using the browser Geolocation API only upon explicit user request.
- **One-Click Copy:** Copies formatted coordinates to the clipboard for sharing with family or responders.
- **External Satellite Map:** One-click launch in OpenStreetMap centered on detected coordinates.
- **Manual District Presets:** Dropdown selector covering all 23 districts of West Bengal with regional hazard notes.
- **Tactical Canvas Reticle:** Lightweight canvas grid visualizer showing location coordinates, bearing rings, and simulated range reticles without external mapping API dependencies.

### 6. Offline Survival Capabilities (PWA & Service Worker)
- **Service Worker (`service-worker.js`):** Employs a Stale-While-Revalidate caching strategy caching the entire app shell, stylesheets, icons, and disaster guides.
- **Web App Manifest (`manifest.json`):** Installable as a Progressive Web App on Android, iOS, Windows, macOS, and Linux.
- **No Internet Required:** Full access to all disaster checklists and helplines once initially loaded.

### 7. Voice Guidance System (Web Speech API)
- **Auditory Accessibility:** Reads safety guidelines aloud using the native browser `SpeechSynthesis` engine.
- **Language Aware:** Automatically pairs with English (`en-IN` / `en-US`) or Bengali (`bn-IN`) system voices where available.
- **Controls:** Play, Pause, Resume, Stop, and customizable speech rates (0.75x, 1.0x, 1.25x).
- **Honest Disclaimer:** Clearly documented as a native browser speech synthesis tool, not an AI chatbot.

### 8. Multilingual Interface (English & বাংলা)
- Native language toggle between **English** and natural **West Bengal Bengali (বাংলা)**.
- Full dictionary covering navigation, buttons, disaster categories, checklists, emergency numbers, disclaimers, and notifications.
- Persists across reloads in `localStorage`.

### 9. Preparedness Readiness Analyzer
- Interactive 7-point household safety assessment.
- Transparent, rule-based scoring engine (0 - 100%).
- Animated progress meters and prioritized, actionable recommendations.
- Prominent educational disclaimer ensuring users understand it is an educational self-check, not a guarantee of safety.

### 10. Community Incident Reporting Demo (Local Drafts)
- Civic tool allowing users to draft local hazard reports:
  - Hazard Categories: Road Flooding, Fallen Tree, Power Outage / Snapped Wire, Damaged Embankment / Culvert, Building Crack.
  - Severity: Low, Medium, High, Critical.
  - Landmark location with one-click GPS coordinate autofill.
  - Image attachment preview using the HTML5 `FileReader` API.
- All reports are stamped with **"Local Draft — Not Submitted"**.
- Full search, filter, view, and deletion capabilities.

---

## 🔒 Trust, Security & Ethical Public Safety Design

Because this application touches public safety, ReliefOS adheres strictly to ethical design principles:
1. **No Fake Dispatches:** ReliefOS never pretends to connect to official emergency services or dispatch rescue teams.
2. **Transparent Demonstration Labels:** All simulated data (tactical radar, community reports) are boldly marked with `DEMO SIMULATION` and `LOCAL DRAFT` badges.
3. **Zero Data Upload:** User location, emergency contacts, and incident drafts are kept strictly inside the user's private browser storage (`localStorage`). No telemetry or analytics are sent to external servers.
4. **Resilient Under Zero Connectivity:** No CDN dependencies or external framework scripts. The entire site works offline out of the box.

---

## 📂 Project Directory Structure

```text
ReliefOS/
├── index.html              # Semantic HTML5 single-page application shell
├── manifest.json           # PWA web application manifest
├── service-worker.js       # Offline service worker caching protocol
├── serve.js                # Minimal local zero-dependency HTTP server
├── README.md               # Project documentation & architectural manual
├── assets/
│   ├── icons/
│   │   ├── logo.svg        # ReliefOS futuristic vector emblem
│   │   ├── cyclone.svg     # Cyclone & storm surge vector icon
│   │   ├── flood.svg       # Riverine & urban flood vector icon
│   │   ├── earthquake.svg  # Seismic fracture vector icon
│   │   ├── heatwave.svg    # Severe summer heatwave vector icon
│   │   └── fire.svg        # Urban high-rise flame vector icon
│   └── images/
├── css/
│   ├── style.css           # Design tokens, reset, typography, layout & HUD grid
│   ├── components.css      # Glassmorphic panels, HUD buttons, inputs & gauges
│   ├── animations.css      # Keyframes, radar sweep, beacon pulse & reduced motion
│   └── responsive.css      # Desktop, tablet, mobile layouts & touch targets
└── js/
    ├── app.js              # Central orchestrator, intro sequence & toast manager
    ├── navigation.js       # Hash router, sidebar, search modal & settings
    ├── dashboard.js        # Live clock, radar canvas, readiness gauge & activity
    ├── emergency.js        # 112 dial confirmation, official helplines & contacts
    ├── geolocation.js      # GPS detector, district selector & tactical reticle
    ├── preparedness.js     # 5 disaster guides, interactive checklists & voice
    ├── reports.js          # Community incident drafts, photo previews & filters
    ├── voice.js            # Web Speech synthesis wrapper (EN / BN)
    ├── translations.js     # Full English & West Bengal Bengali dictionary
    └── storage.js          # Resilient LocalStorage persistence layer
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, Safari, Brave).
- Node.js (optional, for local development server) or any static file server.

### Running Locally

#### Method A: Using Node.js (Included zero-dependency server)
```bash
# Clone or navigate to the repository
cd ReliefOS

# Start the built-in server
node serve.js
```
Open your browser and navigate to:
```
http://127.0.0.1:3000/
```

#### Method B: Using Python
```bash
# Python 3
python -m http.server 3000
```

#### Method C: Using VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deployment Instructions

ReliefOS is 100% frontend-only and requires zero server-side rendering or database infrastructure. It deploys effortlessly to any static hosting service.

### Deploying to GitHub Pages
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial ReliefOS production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ReliefOS.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
4. Click **Save**. Within 1–2 minutes, your site will be live at:
   `https://<your-username>.github.io/ReliefOS/`

### Deploying to Netlify
#### Option 1: Drag-and-Drop (Zero Config)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `ReliefOS` project folder onto the page.
3. Your application is immediately deployed with global CDN distribution and SSL.

#### Option 2: Continuous Deployment via Git
1. Connect your GitHub repository to Netlify.
2. Build command: *(leave blank)*
3. Publish directory: `.` *(root)*
4. Click **Deploy Site**.

---

## ♿ Accessibility & Universal Access

- **Keyboard Navigation:** Full support for `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` for closing modals and dismissing search.
- **Global Shortcut:** Press `Ctrl + K` (or `Cmd + K`) anywhere to summon the global search modal.
- **High-Contrast Mode:** Accessible via Settings or by switching to high-contrast mode for ultra-high legibility in harsh outdoor lighting.
- **Reduced Motion:** System-level and user-toggleable suppression of all non-critical animations.
- **Touch-Friendly Targets:** All emergency dialing buttons feature minimum 48px to 56px touch hitboxes for rapid finger engagement during emergencies.

---

## 📄 License & Attribution

This project is open-source under the **MIT License**.

- **Emergency Helplines:** Sourced from official Government of India (National Emergency Response Support System 112) and West Bengal Disaster Management & Civil Defence department publications.
- **Preparedness Guidance:** Educational recommendations adapted from the National Disaster Management Authority (NDMA) guidelines and India Meteorological Department (IMD) cyclone safety circulars.
