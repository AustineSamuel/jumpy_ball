var cacheName = 'Color-Selector';
var filesToCache = [
 '/index.html',
 '/jumpyBall.js', 
 '/F4J5TCX-ball-hits-ball.mp3',
 '/sounds/TZRM68V-game-over.mp3',
 '/sounds/modern-rnb-all-your-base-15484.mp3',
 '/sounds/audio1.wav',
 '/sounds/audio.wav',
 '/images/bg.jpeg',
 '/images/enemy1.png',
 '/images/enemy2.png',
 '/images/enemy3.png',
 '/images/enemy4.png',
 '/images/enemy6.png',
 '/images/enemy5.png',
 '/images/images.png',
 '/images/images (18).jpeg',
 '/images/images (6).jpeg',
 "https://cdn.jsdelivr.net/npm/sweetalert2@9.3.4/dist/sweetalert2.all.min.js"
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("caches")
      self.clients.claim();
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

//console.log(self.cleints);

//git Serve fetch content when offline 
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate",()=>{
  console.log("PWA activated");
});
