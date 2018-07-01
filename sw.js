const staticCacheName = 'currencyConverter-v3';
//const contentImgsCache = 'currencyConverter-imgs';
const allCaches = [
  staticCacheName,
  //contentImgsCache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/currency-converter/index.html',
        '/currency-converter/js/idbScript/index.js',
        "/currency-converter/js/main.js",
        '/currency-converter/css/index.css',
        '/currency-converter/js/sw/index.js',
        "/currency-converter/js/idb/idb.js",
        "/currency-converter/images/arrow.png",
        "https://unpkg.com/babel-standalone@6/babel.min.js",
        "https://free.currencyconverterapi.com/api/v5/currencies"
      ]).then((msg) =>console.log(msg)).catch(err => console.log("cache errror " + err));
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
    
    if (requestUrl.pathname === '/currency-converter/') {
      console.log('serving root')
      event.respondWith(caches.match('/currency-converter/index.html'))
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(err => {
      console.log("Unable to fetch script from the network. Page in offline mode.")
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
