
const CACHE_NAME = 'birthday-wish-mobile-v1';
const urlsToCache = [
  './',
  './password.html',
  './wish.html',
  './message.html',
  './common.css',
  './config.js',
  './password.js',
  './wish.js',
  './message.js'
];

// 其余代码保持不变
// ... existing code ...
// 安装Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('缓存已打开');
      return cache.addAll(urlsToCache);
    })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
