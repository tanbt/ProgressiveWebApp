// check if `serviceWorker` property is available in navigator (browser object)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {scope: '/'})
    .then(function () {
      //this log could be render before registration finishes (non-blocking)
      console.log('Service Worker registered!');
    });
}
