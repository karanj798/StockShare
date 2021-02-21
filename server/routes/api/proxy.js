const express = require('express')
const axios = require('axios')

const config = require('./../../.config')

// Express router for binding routes.
const router = express.Router()

/**
 * Route to retreive ticker of a search.
 * @name get/symbol
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/symbol', (req, res) => {
    const symbol = req.query.q
    axios.get(`https://finnhub.io/api/v1/search?q=${symbol}&token=${config.finhubKey}`)
        .then((response) => res.send(response.data.result))
        .catch((error) => res.send(error))
})

/**
 * Route to retreive price of a ticker.
 * @name get/quote
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/quote', (req, res) => {
    const ticker = req.query.q
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${config.finhubKey}`)
        .then((response) => res.send(response.data))
        .catch((error) => res.send(error))
})

module.exports = router;