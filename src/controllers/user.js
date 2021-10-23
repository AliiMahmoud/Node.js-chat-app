const userModel = require('../models/user')
const smsSender = require('../../sms-verify')

/**
 * Middleware function to add a registered user into DB 
 * after validation
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.register = async function (req, res) {
    // send a sms
    // then add user from database database
    // session ?? 

    //-- insert into the database
    // email in the session
    // send sms message
    smsSender.sendSMS(req.body.phoneFull).then((_verification) => {
        res.render('login/numberValidation', { name: req.body.name })
    }).catch(_err => res.render('login/index', { error: 'invalid phone number' }))
}


/**
 * Middleware function to login a user 
 * checks the database then check 2FA SMS using twilio
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.login = function (req, res) {
    // TODO get user from database database
    // TODO then send a sms 
    // TODO session ??
    console.log(req.body.phoneFull);
    smsSender.sendSMS(req.body.phoneFull).then((verification) => {
        console.log(verification.status);
        res.render('login/numberValidation', { name: 'ahmed' })
    }).catch(_err => res.render('login/index', { error: 'invalid phone number' }))
}

/**
 * Middleware function to verify user's SMS code
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.verify = function (req, res) {
    let code = req.body.code.join("");
    // TODO check the code with the one in DB if valid or not
    // TODO delete user
    // TODO go to login
    smsSender.verifySMS('', code).then(_verification => {
        if (_verification.status == 'approved')
            res.redirect('/home')
        else
            res.render('login/numberValidation', { name: req.body.name })

    }).catch(err => {
        console.log(err.message)
        res.render('login/numberValidation', { name: req.body.name })
    })
}
