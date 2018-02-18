var dbPromise = idb.open('pwagram-posts-store', 1, function(db) {
    if (!db.objectStoreNames.contains('posts')) { //ObjectStore is like Collection/Table
        db.createObjectStore('posts', {keyPath: 'id'}); // 'id' is like primary key
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