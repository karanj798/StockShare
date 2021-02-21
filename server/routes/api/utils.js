const express = require('express')
const { Parser } = require('json2csv')

const db = require('./../../firebaseApp')

// Express router for binding routes.
const router = express.Router()

/**
 * Route to get csv file with list of transactions.
 * @name get/download
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/download', (req, res) => {
    const id = req.query._id

    // Promise which merges two arrays (bought/sold)
    return new Promise((resolve, reject) => {
        let data = []

        // Get document using id
        db.collection('userCollection').doc(id).get()
            .then(doc => {
                doc.data().bought.forEach(row => data.push({ Ticker: Object.keys(row)[0], Quantity: Object.values(row)[0], Trade_Type: 'Buy' }))
                doc.data().sold.forEach(row => data.push({ Ticker: Object.keys(row)[0], Quantity: Object.values(row)[0], Trade_Type: 'Sell' }))
                resolve(data) 
            })
            .catch(err => reject(err))
        
    })
    .then(data => {

        // Convert JSON data into CSV format
        const parser = new Parser({ fields: ['Ticker', 'Quantity', 'Trade_Type']})
        const csv = parser.parse(data)

        // Send CSV format in plaintext
        res.setHeader('Content-disposition', 'attachment; filename=Transactions.csv')
        res.set('Content-Type', 'text/csv')
        res.status(200).send(csv)
    })
})

module.exports = router;