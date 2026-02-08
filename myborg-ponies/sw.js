/* ============================================================
   MYBORG PONIES - Service Worker
   Caching strategy: Cache-first for static, Network-first for API
   ============================================================ */

const CACHE_NAME = 'myborg-ponies-v1';

const PRECACHE_URLS = [
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/images/icon.svg'
];

// Install: Pre-cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: Cache-first for static assets, network-first for API
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Network-first for external API calls
    if (url.origin !== location.origin) {
        event.respondWith(
            fetch(event.request)
                .catch(() => new Response('Offline', { status: 503 }))
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) {
                    // Update cache in background
                    fetch(event.request).then(response => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, response);
                            });
                        }
                    }).catch(() => {});
                    return cached;
                }
                return fetch(event.request).then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                });
            })
    );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
