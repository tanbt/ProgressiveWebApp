const functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});

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
            res.status(201).json({message: 'Data stored', id: req.body.id});
            return null;
        })
        .catch((err) => {
            res.status(500).json({error: err})
        });
    })
})
