// Service Worker must be placed in root folder to its scope can access all resources
// SW only works in HTTPS

var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v4';
var MAX_CACHE_ITEMS = 10;   // How about max cache size?

function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then(function(cache) {
      return cache.keys() .then(function(keys) {
        if (keys.length > maxItems) {
          cache.delete(keys[0])
            .then(trimCache(cacheName, maxItems));
        }
      })
    })
}

/**
 * `Install` event is called at first registration
 *  or after sw.js is changed and the page is refreshed.
 */
self.addEventListener('install', function(event) {
  console.log('[SW] Installing Service Worker and Pre-caching app shell...', event);

  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      // request to the file, download and store
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/material.min.js',
        '/src/js/promise.js',
        '/src/js/fetch.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/css/material.indigo-pink.min.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ]);
    })
  );
});

/**
 * `Activate` event is called after closing all pages which are currently using *old version* of SW
 */
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating Service Worker...', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList){
        // take an array of Promises when they're all finished.
        return Promise.all(
          keyList.map(function(key) { //for each key in the list
            if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
              console.log('[SW] Removing old cache: ', key);
              return caches.delete(key);
            }
          }
        )); 
      })
  );
  return self.clients.claim();
});

/**
 * Strategy: Cache falling back to network
 * `Fetch` is triggered when a page (or a JS code) sends out a request for resource
/*
self.addEventListener('fetch', function(event) {
  // pass the request to browser to get data and fetch that data as a promise
  event.respondWith(
    caches.match(event.request) //auto-match by request object
      .then(function(response) {
        if (response) {
          return response; // return value from cache, not send out to network
        } else {
          return fetch(event.request)    // cache is null, send request to network
            .then(function(onlineResponse) {
              caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  // store a clone of Response because Response is only consumed ONCE.
                  cache.put(event.request.url, onlineResponse.clone());
                  return onlineResponse;
                })
            })
            .catch(function (err) {
              return caches.open(CACHE_STATIC_NAME)
              .then(function(cache) {
                return cache.match('/offline.html');  //match to a fixed url
              })
            });
        }
      })
  );
});
*/

/**
 * Strategy: Network falling back to cache
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
 */
/*
 self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
    .then(function(response) { 
      return caches.open(CACHE_DYNAMIC_NAME)  //this "then" must always return
        .then(function(cache) {
          cache.put(event.request.url, response.clone());
          return response;
        })
    })
    .catch(function(err) {
      return caches.match(event.request);
    })
  )
});
*/



/**
 * Strategy: Cache then network then re-dynamic-cache
 *  with offline-caching support
 */
self.addEventListener('fetch', function(event) {

  // ONLY for the url which uses Cache-then-network strategy
  var url = 'https://pwagram-45678.firebaseio.com/posts.json';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
      .then(function(cache){
        return fetch(event.request)
        .then(function(res) {
          trimCache(CACHE_DYNAMIC_NAME, MAX_CACHE_ITEMS);
          cache.put(event.request, res.clone());
          return res;
        })
        .catch(function(err){
          console.log('[SW] Cannot update cache for: ' + url);
        })
      })
    )
  } else {  // OTHERWISE, use normal dynamic cache with offline page
    event.respondWith(
      caches.match(event.request) //auto-match by request object
        .then(function(response) {
          if (response) {
            return response; // return value from cache, not send out to network
          } else {
            return fetch(event.request)    // cache is null, send request to network
              .then(function(onlineResponse) {
                caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    // store a clone of Response because Response is only consumed ONCE.
                    cache.put(event.request.url, onlineResponse.clone());
                    return onlineResponse;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  // only return offline.html for not-app-shell pages.
                  if (event.request.headers.get('accept').includes('text/html')) {
                    return cache.match('/offline.html');  //return to a fixed url
                  }
                  // can return some dummy images or css also
                })
              });
          }
        })
    );
  }
});