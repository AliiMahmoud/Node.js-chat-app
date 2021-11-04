const express = require('express')
const userController = require('../../controllers/user')
const userRouter = express.Router()

// Home page
userRouter.get("/home", userController.home)

// Sending a Friendship Request
userRouter.get("/request/:reciever", userController.sendRequest)

// Accepting a Friendship Request
userRouter.get("/accept/:reciever", userController.acceptRequest)

// Rejecting a Friendship Request
userRouter.get("/reject/:reciever", userController.rejectRequest)


// Exporting the user homeRouter
module.exports = userRouter