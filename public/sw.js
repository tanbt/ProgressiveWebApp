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

