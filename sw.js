const staticCacheName = 'currencyConverter-v1';
//const contentImgsCache = 'currencyConverter-imgs';
const allCaches = [
  staticCacheName,
  //contentImgsCache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/js/idbScript/index.js',
        "/js/main.js",
        '/css/index.css',
        '/js/sw/index.js',
        "/js/idb/idb.js",
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('currencyConverter-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    /*
    console.log(
      `request url ${requestUrl.origin}
      location url ${location.origin}
      pathname ${requestUrl.pathname}
    `)*/
    if (requestUrl.pathname === '/') {
      console.log('serving root')
      event.respondWith(caches.match('/index.html'))
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
