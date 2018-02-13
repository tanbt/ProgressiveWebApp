// Service Worker must be placed in root folder to its scope can access all resources
// SW only works in HTTPS

/**
 * `Install` event is called at first registration
 *  or after sw.js is changed and the page is refreshed.
 */
self.addEventListener('install', function(event) {
  console.log('[SW] Installing Service Worker and Pre-caching app shell...', event);

  event.waitUntil(
    caches.open('pre-cache').then(function(cache) {
      // request to the file, download and store
      cache.addAll([
        '/',
        '/index.html',
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
  return self.clients.claim();
});

/**
 * `Fetch` is triggered when a page (or a JS code) sends out a request for resource
 */
self.addEventListener('fetch', function(event) {
  //console.log("[SW] Fetching something...", event);

  // don't respond anything, page not found
  //event.respondWith(null);

  // pass the request to browser to get data and fetch that data as a promise
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // return value from cache, not send out to network
        } else {
          return fetch(event.request);  // cache is null, send request to network
        }
      })
  );
});