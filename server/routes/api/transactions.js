const express = require('express')
const client = require('twilio')
const firebase = require('firebase')

const config = require('./../../.config')
const db = require('./../../firebaseApp')

// Express router for binding routes.
const router = express.Router()

// Creating twilio client with authentication config.
const twilioApp = client(config.twilioConfig.accountSid, config.twilioConfig.authToken)

/**
 * Route to post buy transactions.
 * @name post/buy
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/buy', (req, res) => {
    const id = req.body._id
    const ticker = req.body.ticker
    const qty = req.body.qty

    // Update Firebase document
    db.collection('userCollection').doc(id).update({
        bought: firebase.firestore.FieldValue.arrayUnion({ [ticker]: qty })
    }).then(e => {
        
        // Send a text message after transaction is recorded
        db.collection('userCollection').doc(id).get().then(e => {
            twilioApp.messages
                .create({
                    body: `You've just bought ${ticker} x${qty}.`,
                    from: config.twilioConfig.senderPhoneNumber,
                    to: `+1${e.data().phone}`
                })
                .then(message => res.json({ msg: 'succ' }))
                .catch(error => res.json({ msg: 'error' }))
        })
    })
})

/**
 * Route to post sell transactions.
 * @name post/sell
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/sell', (req, res) => {
    const id = req.body._id
    const ticker = req.body.ticker
    const qty = req.body.qty

    // Update Firebase document
    db.collection('userCollection').doc(id).update({
        sold: firebase.firestore.FieldValue.arrayUnion({ [ticker]: qty })
    }).then(e => {

        // Send a text message after transaction is recorded
        db.collection('userCollection').doc(id).get().then(e => {
            twilioApp.messages
                .create({
                    body: `You've just sold ${ticker} x${qty}.`,
                    from: config.twilioConfig.senderPhoneNumber,
                    to: `+1${e.data().phone}`
                })
                .then(message => res.json({ msg: 'succ' }))
                .catch(error => res.json({ msg: 'error' }))
        })
    })
})

/**
 * Route to retrieve buy transactions.
 * @name get/buy
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/buy', (req, res) => {
    const id = req.query._id

    // Fetch all bought stocks using id of document
    db.collection('userCollection').doc(id).get()
        .then(e => res.json(e.data().bought))
        .catch(err => res.json({ msg: 'err' }))
})

/**
 * Route to retrieve sell transactions.
 * @name get/sell
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/sell', (req, res) => {
    const id = req.query._id

    // Fetch all sold stocks using id of document
    db.collection('userCollection').doc(id).get()
        .then(e => res.json(e.data().sold))
        .catch(err => res.json({ msg: 'err' }))
})

module.exports = router;