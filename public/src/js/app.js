// check if `serviceWorker` property is available in navigator (browser object)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {scope: '/'})
    .then(function () {
      //this log could be render before registration finishes (non-blocking)
      console.log('Service Worker registered!');
    });
}

var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    //resolve('The request is resolved after 3s.');
    reject({code: 500, message: 'An error occurs.'});
  }, 3000)
});
promise.then(function(data) {
  return "Processed data: " + data; //this is the first step
})
// `.catch` can also be here
.then(function(newData) {
  console.log(newData);  //this is the second step
}).catch(function(err) {
  //catch any error in any step and preventing executing its later steps
  console.log(err.code + ": " + err.message);
});

console.log("This line is executed non-blocking.");