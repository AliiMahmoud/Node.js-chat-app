// Loading env variables
require("dotenv").config();
// Dependancies
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const errorHandler = require('./src/middlewares/error-handler')
const router = require('./src/routers/index')
const morgan = require('morgan')
const socket = require('socket.io')
const db = require('./database')

// Setting an instance from the app
const app = express()

// Setting the view engine 
app.set('view engine', 'ejs')

// Middle-wares 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
// app.use(morgan('dev'))
app.use(router);

// Initializing the Project Main Folder 
app.use(express.static(path.join(__dirname, './public')))

// Connecting to the database
db.connect()

// Firing the sever
port = process.env.PORT || 3000
const server = app.listen(port, console.log(`Server is running port ${port}`))

// Initializing socket 
var io = socket(server)

// Chat sockets handler
const chatHandler = require("./chatHandler");
const onConnection = (socket) => {
    chatHandler(io, socket);
}
// connecting the sockets
io.on("connection", onConnection);

// catch 404 and forward to error handler
app.use(function (_req, res, _next) { res.render('404') });
//  Error handler middleware
app.use(errorHandler)



