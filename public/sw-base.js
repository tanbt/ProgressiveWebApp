importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

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

workbox.routing.registerRoute('https://pwagram-45678.firebaseio.com/posts.json',
    (args) => {
        return fetch(args.event.request)
            .then(function (res) {
                var clonedRes = res.clone();
                clearAllData('posts')
                    .then(function () {
                        return clonedRes.json();
                    })
                    .then(function (data) {
                        for (var key in data) {
                            writeData('posts', data[key]);
                        }
                    })
                return res;
            })
    });

workbox.routing.registerRoute((routeData) => {
    return (routeData.event.request.headers.get('accept').includes('text/html'));
},
    (args) => {
        return caches.match(args.event.request) //auto-match by request object
            .then(function (response) {
                if (response) {
                    return response; // return value from cache, not send out to network
                } else {
                    return fetch(args.event.request)    // cache is null, send request to network
                        .then(function (onlineResponse) {
                            caches.open('dynamic')
                                .then(function (cache) {
                                    // store a clone of Response because Response is only consumed ONCE.
                                    cache.put(args.event.request.url, onlineResponse.clone());
                                    return onlineResponse;
                                })
                        })
                        .catch(function (err) {
                            return caches.match('/offline.html')
                                .then(function (res) {
                                    return res;
                                })
                        });
                }
            })
    });

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);