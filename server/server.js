const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const users = require('./routes/api/users')
const transactions = require('./routes/api/transactions')
const proxy = require('./routes/api/proxy')
const utils = require('./routes/api/utils')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', users)
app.use('/api/csv', utils)
app.use('/api/stocks/info', proxy)
app.use('/api/stocks/transactions', transactions)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('/*', (req, res) => {
        res.sendFile(path.join(path.resolve(path.dirname('')), 'client', 'build', 'index.html'))
    })
}

app.listen(process.env.PORT || 3001)
