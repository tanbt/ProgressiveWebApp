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
workbox.precaching.precacheAndRoute([
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "eb733bc548d795f2d9f0e0c82c5c3c85"
  },
  {
    "url": "manifest.json",
    "revision": "c630f9de4da9f7b33982a999f72980ea"
  },
  {
    "url": "offline.html",
    "revision": "deec11e1dc382ada721b00dada3b66ae"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "1f39105f33d9cb5dba48216b6a3634f6"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/css/material.indigo-pink.min.css",
    "revision": "6036fa3a8437615103937662723c1b67"
  },
  {
    "url": "src/images/icons/app-icon-144x144.png",
    "revision": "83011e228238e66949f0aa0f28f128ef"
  },
  {
    "url": "src/images/icons/app-icon-192x192.png",
    "revision": "f927cb7f94b4104142dd6e65dcb600c1"
  },
  {
    "url": "src/images/icons/app-icon-256x256.png",
    "revision": "86c18ed2761e15cd082afb9a86f9093d"
  },
  {
    "url": "src/images/icons/app-icon-384x384.png",
    "revision": "fbb29bd136322381cc69165fd094ac41"
  },
  {
    "url": "src/images/icons/app-icon-48x48.png",
    "revision": "45eb5bd6e938c31cb371481b4719eb14"
  },
  {
    "url": "src/images/icons/app-icon-512x512.png",
    "revision": "d42d62ccce4170072b28e4ae03a8d8d6"
  },
  {
    "url": "src/images/icons/app-icon-96x96.png",
    "revision": "56420472b13ab9ea107f3b6046b0a824"
  },
  {
    "url": "src/images/icons/apple-icon-114x114.png",
    "revision": "74061872747d33e4e9f202bdefef8f03"
  },
  {
    "url": "src/images/icons/apple-icon-120x120.png",
    "revision": "abd1cfb1a51ebe8cddbb9ada65cde578"
  },
  {
    "url": "src/images/icons/apple-icon-144x144.png",
    "revision": "b4b4f7ced5a981dcd18cb2dc9c2b215a"
  },
  {
    "url": "src/images/icons/apple-icon-152x152.png",
    "revision": "841f96b69f9f74931d925afb3f64a9c2"
  },
  {
    "url": "src/images/icons/apple-icon-180x180.png",
    "revision": "2e5e6e6f2685236ab6b0c59b0faebab5"
  },
  {
    "url": "src/images/icons/apple-icon-57x57.png",
    "revision": "cc93af251fd66d09b099e90bfc0427a8"
  },
  {
    "url": "src/images/icons/apple-icon-60x60.png",
    "revision": "18b745d372987b94d72febb4d7b3fd70"
  },
  {
    "url": "src/images/icons/apple-icon-72x72.png",
    "revision": "b650bbe358908a2b217a0087011266b5"
  },
  {
    "url": "src/images/icons/apple-icon-76x76.png",
    "revision": "bf10706510089815f7bacee1f438291c"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  },
  {
    "url": "src/js/app.js",
    "revision": "22dc510279b130e12bc0b5de21c2fd32"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "0a256fbd92455c45a70a629877e389fb"
  },
  {
    "url": "src/js/feed.js",
    "revision": "4cf3825eeda576af11c4b3c62fa22900"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "71880e3090551b0274752e37f5c53549"
  },
  {
    "url": "sw-base.js",
    "revision": "43477af5667e0eb2dd6e8762fa57082f"
  },
  {
    "url": "sw.js",
    "revision": "2e25ad642a4600a4d3ebb9095ecdfa96"
  }
]);

/**
 * Trigger when the connection is re-established
 *  or when a 'sync' is registered
 */
/**
 * Trigger when the connection is re-established
 *  or when a 'sync' is registered
 */
self.addEventListener('sync', function (event) {
    console.log('[SW] Background syncing', event);
    if (event.tag === 'sync-new-post') {
        console.log('[SW] Syncing new post...');
        event.waitUntil(
            readAllData('sync-posts')
                .then(function (data) {
                    data.forEach(dt => {
                        var postData = new FormData();
                        postData.append('id', dt.id);
                        postData.append('title', dt.title);
                        postData.append('location', dt.location);
                        postData.append('rawLocationLat', dt.rawLocation.lat);
                        postData.append('rawLocationLng', dt.rawLocation.lng);
                        postData.append('file', dt.picture, dt.id + '.png');

                        fetch('https://us-central1-pwagram-45678.cloudfunctions.net/storePostData', {
                            method: 'POST',
                            body: postData
                        })
                            .then(function (res) {
                                console.log('Sent data');
                                if (res.ok) {
                                    res.json()
                                        .then(function (resData) {
                                            console.log(resData);
                                            removeItemById('sync-posts', resData.id);
                                        })
                                }
                            })
                            .catch(function (err) {
                                console.log('Error while sending data: ', err);
                            })
                    });
                })
        );
    }
});