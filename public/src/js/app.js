// check if `serviceWorker` property is available in navigator (browser object)
if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {scope: '/'})
    .then(function () {
      //this log could be render before registration finishes (non-blocking)
      console.log('Service Worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
