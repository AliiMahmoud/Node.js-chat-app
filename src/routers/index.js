const express = require('express')
// Subrouters
const authentication = require('./user/authentication')
const homeRouter = require('./user/home')

const router = express.Router()

// App Index Page
router.get("/", (req, res) => req.session.uid ? res.redirect('/home') : res.render('login/index'))

// Using the sub-routers
router.use('/', authentication)
router.use('/', homeRouter)



// Exporting the main router
module.exports = router