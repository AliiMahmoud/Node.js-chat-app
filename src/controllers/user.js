const userModel = require('../models/user')
const smsSender = require('../../sms-verify')

var session = {}
/**
 * Function to add a registered user into DB 
 * after validation
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.register = async function (req, res) {
    // TODO session ?? 
    // if session redirect -> home
    let { name, phoneFull, password } = req.body
    isValid = await smsSender.validateNumber(phoneFull)
    if (isValid) {
        // Inserting the user in the database
        userModel.insertUser(name, phoneFull, password)
            .then((data) => {
                if (data) {
                    session['userPhone'] = phoneFull
                    session['name'] = name
                    smsSender.sendSMS(phoneFull)
                    res.render('login/numberValidation', { name: name })
                }
                else
                    res.render('login/index', { error: 'Something went Wrong, try again' })
            })
            .catch((err) => {
                res.render('login/index', { error: 'Number Already Exists' })
            })
    }
    else
        res.render('login/index', { error: 'Invalid Phone Number' })
}


/**
 * Function to login a user 
 * checks the database then check 2FA SMS using twilio
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.login = function (req, res) {
    // if session redirect -> home 403
    var { phoneFull, password } = req.body
    // Getting user from database
    userModel.getUser(phoneFull, password)
        .then((data) => {
            if (data) {
                // TODO change
                session['userPhone'] = phoneFull
                session['name'] = data.name
                res.render('login/numberValidation', { name: data.name })
                smsSender.sendSMS(phoneFull).then((_v) => console.log(_v)).catch((err) => console.log(err.message))
            }
            else
                res.render('login/index', { error: 'Invalid Credentials' })
        })
        .catch((_err) => {
            res.render('login/index', { error: 'Invalid Credentials' })
        })
}


/**
 * Function to verify user's SMS code
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.verify = function (req, res) {
    let code = req.body.code;
    console.log(session['userPhone'])
    if (session['userPhone']) {
        smsSender.verifySMS(session['userPhone'], code).then(_verification => {
            if (_verification.status == 'approved') {
                // TODO ?? SESSION
                res.status(200).end()
            }
            else
            // TODO Destroy the session
            {
                console.log('not approved');
                res.status(406).end();

            }
        }).catch(_err => {

            console.log(_err.message);
            // TODO Destroy the session
            res.status(500).end()
        })
    }
    else {
        // TODO destroy the session

        console.log('session shit');
        res.status(403).end()
    }
}


/**
 * Function to resned SMS to the user for 2FA
 * @param req - express Request handler Object
 * @param res - express Response Object
 */
module.exports.resendCode = function (req, res) {
    console.log(session['userPhone'])
    if (session['userPhone']) {
        smsSender.sendSMS(session['userPhone'])
            .then((_ver) => { res.status(200).end(); console.log('sent') })
            // TODO destroy the session
            .catch((_errr) => { res.status(500).end(); console.log('sent') })
    }
    else {
        console.log('session shit');
        // TODO destroy the session
        res.status(403).end()
    }

}
