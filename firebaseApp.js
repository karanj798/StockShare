const firebase = require('firebase')

const config = require('./.config')

// Initialize Firebase app
firebase.initializeApp(config.firebaseConfig)

module.exports = firebase.firestore()