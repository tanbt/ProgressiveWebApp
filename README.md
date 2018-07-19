# Progressive Web Apps - Complete Guide
This source code is part of Maximilian Schwarzmüller's "Progressive Web Apps - Complete Guide" course on udemy.com.
[Google PWA](https://developers.google.com/web/ilt/pwa/)

# Commands:
* npm install
* change directory to *functions* folder, run `npm install`
* at root directory, run `npm start`
* at *functions* directory, run `npm run web-push generate-vapid-keys` to get notification subscription key.
    update the publc key in app.js file, at `var vapidPublickey`
*

# How to update firebase function
* update the `index.js` file in *functions* folder
* in root folder (parent folder of *functions* folder), run `firebase deploy` 

# How to Use
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.

# References
* Are Service Workers Ready? - [Check Browser Support](https://jakearchibald.github.io/isserviceworkerready/)
* Setting up [Remote Debugging on Chrome](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)
* Getting that [Web App Install Banner](https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/)
* Getting Started with [Service Workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
* Web API [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
* [Caching strategies](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#the_cache_machine_-_when_to_store_resources)
* [Wrap IndexDB into Promise](https://github.com/jakearchibald/idb)
* [Loading responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
* [Firebase Hosting](https://firebase.google.com/docs/hosting/deploying)

## Troubleshooting
* In Windows, have to use Firebase CLI in `cmd`, not git bash 
* Cannot install npm because of permision of writing cache
** MacOS: sudo chown -R root /cache/path
* Cannot run *firebase deploy* because of *$RESOURCE_DIR*
** Have to stay at root folder, instead of `functions` folder
** The path to project location contains special characters (e.g. whitespace)

## External demo resourece
* [API resource](https://httpbin.org/)
* Firebase account: [tanbt@vaadin.com](https://console.firebase.google.com/u/1/project/pwagram-45678/database/pwagram-45678/data)

