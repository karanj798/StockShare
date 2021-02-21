const express = require('express')
const client = require('twilio')
const firebase = require('firebase')

const config = require('./../../.config')
const db = require('./../../firebaseApp')

const router = express.Router()

const twilioApp = client(config.twilioConfig.accountSid, config.twilioConfig.authToken)

router.post('/buy', (req, res) => {
    const id = req.body._id
    const ticker = req.body.ticker
    const qty = req.body.qty

    db.collection('userCollection').doc(id).update({
        bought: firebase.firestore.FieldValue.arrayUnion({ [ticker]: qty })
    }).then(e => {
        db.collection('userCollection').doc(id).get().then(e => {
            twilioApp.messages
                .create({
                    body: `You've just bought ${ticker} x${qty}.`,
                    from: '+17634017978',
                    to: `+1${e.data().phone}`
                })
                .then(message => res.json({ msg: 'succ' }))
                .catch(error => res.json({ msg: 'error' }))
        })
    })
})

router.post('/sell', (req, res) => {
    const id = req.body._id
    const ticker = req.body.ticker
    const qty = req.body.qty

    db.collection('userCollection').doc(id).update({
        sold: firebase.firestore.FieldValue.arrayUnion({ [ticker]: qty })
    }).then(e => {
        db.collection('userCollection').doc(id).get().then(e => {
            twilioApp.messages
                .create({
                    body: `You've just sold ${ticker} x${qty}.`,
                    from: '+17634017978',
                    to: `+1${e.data().phone}`
                })
                .then(message => res.json({ msg: 'succ' }))
                .catch(error => res.json({ msg: 'error' }))
        })
    })
})

router.get('/buy', (req, res) => {
    const id = req.query._id
    db.collection('userCollection').doc(id).get()
    .then(e => res.json(e.data().bought))
    .catch(err => res.json({msg: 'err'}))
})

router.get('/sell', (req, res) => {
    const id = req.query._id
    db.collection('userCollection').doc(id).get()
    .then(e => res.json(e.data().sold))
    .catch(err => res.json({msg: 'err'}))
})

module.exports = router;