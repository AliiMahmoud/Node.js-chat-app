const express = require('express')
// Subrouters
const authentication = require('./user/authentication')

const router = express.Router()

// App Index Page
router.get("/", (req, res) => {
    res.render('index')
})

// Using the sub-router
router.use('/', authentication)

// Exporting the main router
module.exports = router