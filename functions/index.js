const functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var serviceAccount = require("./pwagram-fbk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwagram-45678.firebaseio.com"
});

exports.storePostData = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        admin.database().ref('posts').push({
            id: req.body.id,
            title: req.body.title,
            location: req.body.location,
            image: req.body.image
        })
        .then(() => {
            webpush.setVapidDetails('mailto:trungtanbui@gmail.com', 'BBXrTR9zlJLI3ikWgV2ssi4KUbyDZNAxg5byQjsdK6ymGX3Uj4XA1ottH6UIbtoV0EJQh_lo2QJdxiUOvI-h08I', 'tJ9nDceYoj9Id5mhKJK7D4LqvIO1pMJoeUGoXL-Ngt4');
            return admin.database().ref('subscriptions').once('value');
        })
      .then((subscriptions) => {
        subscriptions.forEach((sub) => {
          let pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
                auth: sub.val().keys.auth,
                p256dh: sub.val().keys.p256dh
            }
          };
          webpush.sendNotification(pushConfig, JSON.stringify({title: 'New Post', content: 'New post added!'}))
            .catch((err) => {
                console.log(err);
            });
        });
        res.status(201).json({message: 'Data stored', id: req.body.id});
        return null;
      })
        .catch((err) => {
            res.status(500).json({error: err})
        });
    })
})
