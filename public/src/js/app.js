var enableNotificationButtons = document.querySelectorAll('.enable-notifications');

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

// work with notification WebAPI
if ('Notification' in window) {
  enableNotificationButtons.forEach(function(btn) {
    btn.style.display='inline-block';
    btn.addEventListener('click', askForNotificationPermission);
  });
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User choice: ', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      //todo: Hibe button if necessary
      displayConfirmNotification();
    }
  });
}

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
        body: 'You successfully subscribed to our Notification Service',
        icon: '/src/images/icons/app-icon-96x96.png',
        image: '/src/images/sf-boat.jpg',
        dir: 'rtl',
        lang: 'en-US', // BCP 47
        vibrate: [100, 50, 200],
        badge: '/src/images/icons/app-icon-96x96.png',
        tag: 'confirm-notificaiton',
        renotify: true,
        actions: [
          { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
          { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
        ]
    };
    
    navigator.serviceWorker.ready.then(function(swreg) {
      swreg.showNotification('Successfully subscribed! (fron SW)', options);
    })
  }
}