const express = require('express')

const db = require('./../../firebaseApp')

// Express router for binding routes.
const router = express.Router()

/**
 * Route to verify login details of user.
 * @name post/login
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    // Fetch all documents from the collection
    db.collection('userCollection')
        .get()
        .then(querySnapShot => {
            return new Promise((resolve, reject) => {
                querySnapShot.forEach(doc => {

                    // Check current username/password with ones from request's body
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

/**
 * Route to verify registration details of user.
 * @name post/register
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const phone = req.body.phone

    // Fetch document which contains same username as one from request's body
    db.collection('userCollection').where('username', '==', username.toLowerCase())
        .get()
        .then(querySnapShot => {
            if (querySnapShot.empty) {

                // No documents found, register the user
                db.collection('userCollection').add({ username: username, password: password, phone: phone, bought: [], sold: [], balance: 10000 })
                    .then(e => res.json({ status: true }))
            } else {

                // Duplicate username was found, reject request
                res.json({ msg: 'bad' })
            }
        })
})

module.exports = router;