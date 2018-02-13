// Service Worker must be placed in root folder to its scope can access all resources
// SW only works in HTTPS

/**
 * `Install` event is called at first registration
 *  or after sw.js is changed and the page is refreshed.
 */
self.addEventListener('install', function(event) {
  console.log("[SW] Installing Service Worker...", event);
});

/**
 * `Activate` event is called after closing all pages which are currently using *old version* of SW
 */
self.addEventListener('activate', function(event) {
  console.log("[SW] Activating Service Worker...", event);
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
  event.respondWith(fetch(event.request));
});