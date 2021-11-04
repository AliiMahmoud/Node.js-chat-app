const express = require('express')
const loginController = require('../../controllers/login')

const loginRouter = express.Router()

// Login Methods
loginRouter.post("/login", loginController.login)
loginRouter.get("/login", (req, res) => req.session.uid ? res.redirect('/home') : res.redirect('/home'))

// Sign-up Methods
loginRouter.post("/signup", loginController.register)
loginRouter.get("/signup", (req, res) => req.session.uid ? res.redirect('/home') : res.redirect('/home'))

// 2FA code Verification
loginRouter.post("/verify-number", loginController.verify)

// Re-send 2FA login code 
loginRouter.get("/resendcode", loginController.resendCode)

// User Logout
loginRouter.get("/logout", loginController.logout)


// Exporting the main loginRouter
module.exports = loginRouter