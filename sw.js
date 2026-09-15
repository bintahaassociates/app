const CACHE_NAME = 'bintaha-app-v1';

// Tamam 20 files jo offline load hongi
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './properties.html',
  './dream.html',
  './services.html',
  './about.html',
  './contact.html',
  './add-property.html',
  './client-form.html',
  './signin.html',
  './signup.html',
  './agent-login.html',
  './agent-dashboard.html',
  './crm-dashboard.html',
  './owners-crm.html',
  './inbox.html',
  './logo.png',
  './logo.png.png',
  './taha.jpg',
  './taha1.jpg',
  './manifest.json'
];

// Install Event - Files Cache Karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all Bin Taha assets for offline use...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Purana Cache Clear Karna
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Offline Mode Handle Karna
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Agar page HTML hai aur network nahi mila
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});