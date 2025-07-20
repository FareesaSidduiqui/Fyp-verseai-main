// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccountKey.json"); // Replace with your downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
