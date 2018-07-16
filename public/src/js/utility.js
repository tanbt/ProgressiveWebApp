var dbPromise = idb.open('pwagram-posts-store', 1, function(db) {
    if (!db.objectStoreNames.contains('posts')) { //ObjectStore is like Collection/Table
        db.createObjectStore('posts', {keyPath: 'id'}); // 'id' is like primary key
    }
    if (!db.objectStoreNames.contains('sync-posts')) { //ObjectStore is like Collection/Table
        db.createObjectStore('sync-posts', {keyPath: 'id'}); // 'id' is like primary key
    }
});

function writeData(storeName, data) {
    return dbPromise.then(function(db) {
        var trans = db.transaction(storeName, 'readwrite');
        var store = trans.objectStore(storeName);
        store.put(data);    // overwrite data if existed
        return trans.complete;
      })
}

function readAllData(storeName) {
    return dbPromise
        .then(function(db) {
            var trans = db.transaction(storeName, 'readonly');
            var store = trans.objectStore(storeName)
            return store.getAll();  //don't care if transaction is complete or not
        });
}

function clearAllData(storeName) {
    return dbPromise.then(function(db) {
        var tx = db.transaction(storeName, 'readwrite');
        var store = tx.objectStore(storeName);
        store.clear();
        return tx.complete;
    })
}

/**
 * Remove an item in IndexedDB
 * 
 * @param storeName Collection name
 * @param id Id of the item
 * @example
 *      in console of browser: removeItemById('posts', 'post-1');
 */
function removeItemById(storeName, id) {
    return dbPromise.then(function(db) {
        var tx = db.transaction(storeName, 'readwrite');
        var store = tx.objectStore(storeName);
        store.delete(id);
        return tx.complete;
    })
    .then(function() {
        console.log('Item deleted: ' + id);
    })
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
