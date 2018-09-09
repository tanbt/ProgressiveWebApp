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