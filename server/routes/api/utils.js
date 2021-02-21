const express = require('express')
const { Parser } = require('json2csv')

const db = require('./../../firebaseApp')

const router = express.Router()

router.get('/download', (req, res) => {
    const id = req.query._id


    return new Promise((resolve, reject) => {
        let data = []
        db.collection('userCollection').doc(id).get()
            .then(doc => {
                doc.data().bought.forEach(row => data.push({ Ticker: Object.keys(row)[0], Quantity: Object.values(row)[0], Trade_Type: 'Buy' }))
                doc.data().sold.forEach(row => data.push({ Ticker: Object.keys(row)[0], Quantity: Object.values(row)[0], Trade_Type: 'Sell' }))
                resolve(data) 
            })
            .catch(err => reject(err))
        
    })
    .then(data => {
        const parser = new Parser({ fields: ['Ticker', 'Quantity', 'Trade_Type']})
        const csv = parser.parse(data)
        res.setHeader('Content-disposition', 'attachment; filename=Transactions.csv')
        res.set('Content-Type', 'text/csv')
        res.status(200).send(csv)
    })
})

module.exports = router;