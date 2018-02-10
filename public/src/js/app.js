// check if `serviceWorker` property is available in navigator (browser object)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service Worker registered!');
    });
}
