const userModel = require('../models/user')

/**
 * Middleware function to add a registered user into DB 
 * after validation
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.register = async function (req, res) {
    let { email, password } = req.body
    console.log(`${email}: ${password}`);
    res.status(200).json({})
    // validating the email and the hash with the schema
}


/**
 * Middleware function to login a user 
 * after validating the data
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.login = async function (req, res) {
    let { email, password } = req.body
    console.log(`${email}: ${password}`);
    res.status(200).json({})
}
