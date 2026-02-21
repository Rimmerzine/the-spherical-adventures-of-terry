const CACHE_NAME = 'the-spherical-adventures-of-terry';
const ASSETS = [
  "/",
  "/index.html",
  "/build/background/BackgroundObject.js",
  "/build/background/BoundedBackgroundObject.js",
  "/build/background/Cloud.js",
  "/build/background/Eye.js",
  "/build/background/HeightlessBackgroundObject.js",
  "/build/background/LavaFalls.js",
  "/build/background/Skyscraper.js",
  "/build/background/Snow.js",
  "/build/background/Star.js",
  "/build/ball/Ball.js",
  "/build/ball/BallAttributes.js",
  "/build/ball/BallSkills.js",
  "/build/level/Level.js",
  "/build/level/LevelGenerator.js",
  "/build/level/LevelSettings.js",
  "/build/player/Player.js",
  "/build/player/PlayerStats.js",
  "/build/terrain/Terrain.js",
  "/build/terrain/TerrainManager.js",
  "/build/terrain/TerrainSettings.js",
  "/build/ui/UIAttributeText.js",
  "/build/ui/UIButton.js",
  "/build/ui/UIContainer.js",
  "/build/ui/UIElement.js",
  "/build/ui/UIManager.js",
  "/build/ui/UIOpenWindowButton.js",
  "/build/ui/UISkillUpgradeSection.js",
  "/build/ui/UIText.js",
  "/build/ui/UIWindow.js",
  "/build/utils/Vector.js",
  "/build/Camera.js",
  "/build/CanvasRenderer.js",
  "/build/CollisionDetection.js",
  "/build/GameManager.js",
  "/build/index.js",
  "/build/InputManager.js",
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
