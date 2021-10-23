const express = require('express')
const userController = require('../../controllers/user')

const loginRouter = express.Router()

// Login submit
loginRouter.post("/login", userController.login)
loginRouter.get("/login", (req, res) => res.redirect('/'))

// Sign-up sumbition
loginRouter.post("/signup", userController.register)
loginRouter.get("/signup", (req, res) => res.redirect('/'))

loginRouter.post("/verify-number", userController.verify)

// home - after successful login
loginRouter.get("/home", (req, res) => res.end())


// Exporting the main loginRouter
module.exports = loginRouter