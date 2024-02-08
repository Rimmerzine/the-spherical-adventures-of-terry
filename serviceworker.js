const terry = "terry"

const assets = [
  "/",
  "/index.html",
  "/build/background/Cloud.js",
  "/build/background/Eye.js",
  "/build/ball/Ball.js",
  "/build/ball/BallAttributes.js",
  "/build/ball/BallStats.js",
  "/build/cloud/Cloud.js",
  "/build/cloud/CloudParticle.js",
  "/build/terrain/Terrain.js",
  "/build/terrain/TerrainManager.js",
  "/build/terrain/TerrainSettings.js",
  "/build/utils/BackgroundObject.js",
  "/build/utils/Position2D.js",
  "/build/utils/Vector2D.js",
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

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(terry).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
