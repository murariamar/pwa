var CACHE_STATIC = 'static-v4';
var CACHE_DYNAMIC = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waituntill(
    caches.open(CACHE_STATIC).then(function(cache) {
      console.log('[sw] precaching app shell..........');
      cache.addAll([
        '/',
        '/index.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  // cleanup old cache
  event.waituntill(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC || key !== CACHE_DYNAMIC) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      if (res) {
        return res;
      } else {
        return fetch(event.request)
          .then(function(response) {
            return caches.open(CACHE_DYNAMIC).then(function(cache) {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(function(err) {
            console.log('err.......', err);
          });
      }
    })
  );
});
