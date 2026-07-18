// Invisible Exit Service Worker — PWA offline support + performance caching
const CACHE_VERSION = 'ie-v2';
const STATIC_CACHE = `ie-static-${CACHE_VERSION}`;
const PAGE_CACHE = `ie-pages-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/site.webmanifest',
];

// Install — pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - Navigation requests: network-first, cache fallback. NOT cache-first —
//   stale HTML references old hashed chunks after a deploy → white screen.
// - Static assets (JS/CSS/fonts): cache-first (immutable, hashed filenames)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (analytics, APIs)
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API/dashboard routes
  if (url.pathname.startsWith('/dashboard') || 
      url.pathname.includes('/api/') ||
      url.pathname.startsWith('/auth')) return;

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(PAGE_CACHE).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await cache.match(request);
          return cached || cache.match('/');
        }
      })
    );
    return;
  }

  // Static assets (hashed filenames = immutable)
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.match(/\.(js|css|woff2?|svg|png|jpg|webp)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => 
        cached || fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
      )
    );
    return;
  }
});
