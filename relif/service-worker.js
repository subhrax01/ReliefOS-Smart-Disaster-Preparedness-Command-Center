/* ReliefOS Service Worker — Offline Disaster Survival Protocol v1.0.0 */
const CACHE_NAME = 'reliefos-core-v1.0.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/components.css',
  './css/animations.css',
  './css/responsive.css',
  './js/app.js',
  './js/storage.js',
  './js/translations.js',
  './js/voice.js',
  './js/geolocation.js',
  './js/emergency.js',
  './js/preparedness.js',
  './js/reports.js',
  './js/dashboard.js',
  './js/navigation.js',
  './assets/icons/logo.svg',
  './assets/icons/cyclone.svg',
  './assets/icons/flood.svg',
  './assets/icons/earthquake.svg',
  './assets/icons/heatwave.svg',
  './assets/icons/fire.svg'
];

// Install: precache all critical app-shell resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use map with catch to ensure install succeeds even if one non-critical file is missing during dev
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`[ReliefOS SW] Precache warning for ${url}:`, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated cache tiers
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[ReliefOS SW] Purging obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for optimal offline resilience
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If requesting local app assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch((err) => {
          // Network failed, cache is our lifeline
          return cachedResponse;
        });

        // Return cached immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
  }
});
