const express = require('express')

const db = require('./../../firebaseApp')

const router = express.Router()


router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.collection('userCollection')
        .get()
        .then(querySnapShot => {
            return new Promise((resolve, reject) => {
                querySnapShot.forEach(doc => {
                    if (doc.data().username == username && doc.data().password == password) {
                        resolve({ status: 'good', _id: doc.id })
                    }
                })
                reject({ msg: 'bad' })
            })
                .then(message => res.json(message))
                .catch(message => res.json(message))
        })
})

router.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const phone = req.body.phone

    db.collection('userCollection').where('username', '==', username.toLowerCase())
        .get()
        .then(querySnapShot => {
            if (querySnapShot.empty) {
                db.collection('userCollection').add({ username: username, password: password, phone: phone, bought: [], sold: [], balance: 10000 })
                    .then(e => res.json({ status: true }))
            } else {
                res.json({ msg: 'bad' })
            }
        })
})

module.exports = router;