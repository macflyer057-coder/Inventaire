const CACHE_NAME = "essieux-cache-v2"; // change le numéro à chaque mise à jour
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Installation : mise en cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // active immédiatement la nouvelle version
});

// Activation : suppression des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  clients.claim(); // prend le contrôle immédiatement
});

// Fetch : réseau d'abord, cache en secours
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => caches.match(event.request))
  );
});
