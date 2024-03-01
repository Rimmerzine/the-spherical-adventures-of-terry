const CACHE_NAME = 'the-spherical-adventures-of-terry';
const ASSETS = [
  "/",
  "/index.html",
  "/build/background/Cloud.js",
  "/build/background/Eye.js",
  "/build/background/Star.js",
  "/build/ball/Ball.js",
  "/build/ball/BallAttributes.js",
  "/build/ball/BallStats.js",
  "/build/cloud/Cloud.js",
  "/build/cloud/CloudParticle.js",
  "/build/terrain/Terrain.js",
  "/build/terrain/TerrainManager.js",
  "/build/terrain/TerrainSettings.js",
  "/build/utils/BackgroundObject.js",
  "/build/utils/Vector.js",
  "/build/utils/Vector.js",
  "/build/Camera.js",
  "/build/CanvasRenderer.js",
  "/build/CollisionDetection.js",
  "/build/GameManager.js",
  "/build/index.js",
  "/build/InputManager.js",
  "/build/Level.js",
  "/build/PlayerStats.js",
  "/build/Settings.js",
  "/favicon.ico"
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return await caches.match(event.request);
      }
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});
