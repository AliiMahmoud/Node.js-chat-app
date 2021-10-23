// Dependancies
const express = require('express')
const path = require('path')
const errorHandler = require('./src/middlewares/error-handler')
const router = require('./src/routers/index')
const morgan = require('morgan')

// Setting an instance from the app
const app = express()

// Setting the view engine 
app.set('view engine', 'ejs')

// Middle-wares 
app.use(express.json())
app.use(morgan('dev'))
app.use(router);

// Initializing the Project Main Folder 
app.use(express.static(path.join(__dirname, './public')))

// catch 404 and forward to error handler
app.use(function (_req, res, _next) {
    res.status(404).send("Not Found")
});
//  Error handler middleware
app.use(errorHandler)

// Firing the sever
port = process.env.PORT || 3000
app.listen(port, console.log(`Server is running port ${port}`))




