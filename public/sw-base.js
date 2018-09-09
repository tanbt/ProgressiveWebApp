importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

workbox.routing.registerRoute(new RegExp('.*(?:gstatic)\.com.*$'), workbox.strategies.staleWhileRevalidate(
    {
        cacheName: 'google-fonts',
        plugins: [
            new workbox.expiration.Plugin({
              maxAgeSeconds: 7 * 24 * 60 * 60,
              maxEntries: 5,
            }),
          ]
    }
));

workbox.routing.registerRoute(new RegExp('.*(?:googleapis)\.com.*$'), workbox.strategies.staleWhileRevalidate(
    { cacheName: 'post-resource' }
));

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);