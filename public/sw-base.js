importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

workbox.routing.registerRoute(new RegExp('.*(?:googleapis|gstatic)\.com.*$'), workbox.strategies.staleWhileRevalidate(
    {cacheName: 'google-fonts'}
));

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);