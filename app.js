// Loading env variables
require("dotenv").config();
// Dependancies
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const errorHandler = require('./src/middlewares/error-handler') // MIDLLEWARE ERROR HANDLER 
const router = require('./src/routers/index') // ROUTER 
const socket = require('socket.io')  // SOCKET CONNECTION
var cookieParser = require('cookie-parser');
var session = require('express-session');
const db = require('./database') // POSTGRES DATABASE CONNECTION
const socketsHandler = require("./socketsHandler"); // SOCKET EVENTS HANDLER

// Setting an instance from the app
const app = express()

// Session Initialization
app.use(cookieParser());
const sessionMiddleware = session({ secret: process.env.SESSION_SECRET, saveUninitialized: true, resave: true })
app.use(sessionMiddleware);

// Setting the view engine 
app.set('view engine', 'ejs')

// Middle-wares 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(router);

// Initializing the Project Main Folder 
app.use(express.static(path.join(__dirname, './public')))

// Connecting to the database
db.connect()

// Firing the sever
port = process.env.PORT || 3000
const server = app.listen(process.env.PORT || 3000, console.log(`Server is running port ${port}`))

/// Initializing the socket 
var io = socket(server)
// Middleware session that forwards the request to access session inside the socket request 
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});

const onConnection = (socket) => { socketsHandler(io, socket) }
// connecting the sockets
io.on("connection", onConnection);

// catch 404 and forward to error handler
app.use(function (_req, res, _next) { res.render('404') });
//  Error handler middleware
app.use(errorHandler)
