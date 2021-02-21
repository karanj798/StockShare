const express = require('express')
const axios = require('axios')

const config = require('./../../.config')

const router = express.Router()

router.get('/symbol', (req, res) => {
    const symbol = req.query.q
    axios.get(`https://finnhub.io/api/v1/search?q=${symbol}&token=${config.finhubKey}`)
        .then((response) => res.send(response.data.result))
        .catch((error) => res.send(error))
})

router.get('/quote', (req, res) => {
    const ticker = req.query.q
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${config.finhubKey}`)
        .then((response) => res.send(response.data))
        .catch((error) => res.send(error))
})

module.exports = router;