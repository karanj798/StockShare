const firebase = require('firebase')

const config = require('./.config')

firebase.initializeApp(config.firebaseConfig)
const db = firebase.firestore()

module.exports = db;