const express = require('express')
const userController = require('../../controllers/user')

const loginRouter = express.Router()

// Login page 
loginRouter.get("/login", (req, res) => { res.status(200).json() })
// Login submit
loginRouter.post("/login", userController.login)

// Sign-up page 
loginRouter.get("/signup", (req, res) => { res.status(200).json() })
// Sign-up sumbition
loginRouter.post("/signup", userController.register)


// Exporting the main loginRouter
module.exports = loginRouter