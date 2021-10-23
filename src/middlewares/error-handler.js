// Getting the Node current environemet
let isProduction = (process.env.NODE_ENV === 'production')

function errorHandler(err, _req, res, _next) {

    // Print Stack trace while developing only
    if (!isProduction)
        console.log(err.stack);

    // default to 500 server error
    return res.status(err.status || 500).json({ success: "false", message: err.message });
}

module.exports = errorHandler;