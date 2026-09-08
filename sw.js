/* Ride the Rail — offline shell.

   Bump CACHE whenever you change any of the files below. The old cache is
   deleted on activate, so a version bump is the whole upgrade story: edit,
   bump, reload twice. Without the bump you will keep seeing the old build
   and wonder why your changes have not landed. */
const CACHE = 'rtr-v1';
const SHELL = [
  './',
  './index.html',
  './three.min.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Cache first. The game is a fixed set of files and never talks to a server,
   so there is nothing to be fresh about — and going to the cache first is what
   lets it start with the aeroplane mode switch on. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic'){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
