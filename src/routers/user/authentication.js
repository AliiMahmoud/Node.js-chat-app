const express = require('express')
const userController = require('../../controllers/user')

const loginRouter = express.Router()

// Login submit
loginRouter.post("/login", userController.login)
loginRouter.get("/login", (_req, res) => res.redirect('/'))

// Sign-up sumbition
loginRouter.post("/signup", userController.register)
loginRouter.get("/signup", (_req, res) => res.redirect('/'))

loginRouter.post("/verify-number", userController.verify)

// Re-send 2FA login code 
loginRouter.get("/resendcode", userController.resendCode)

// home - after successful login
loginRouter.get("/home", (_req, res) => res.render('home'))



// Exporting the main loginRouter
module.exports = loginRouter