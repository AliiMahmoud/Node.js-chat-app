const userModel = require('../models/user')
const smsSender = require('../../sms-verify')

/**
 * Function to add a registered user into DB 
 * after validation
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.register = async function (req, res) {

    if (req.session.uid) { res.redirect('/home'); return }
    let { name, phoneFull, password } = req.body
    /// isValid = await smsSender.validateNumber(phoneFull)
    let isValid = true
    if (isValid) {
        // Inserting the user in the database
        userModel.insertUser(name, phoneFull, password)
            .then((data) => {
                if (data) {
                    req.session.uid = phoneFull
                    res.redirect('/home')
                    /// res.render('login/numberValidation', { name: name })
                    /// smsSender.sendSMS(phoneFull)
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
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.login = function (req, res) {

    if (req.session.uid) { res.redirect('/home'); return }

    var { phoneFull, password } = req.body
    // Getting user from database
    userModel.getUser(phoneFull, password)
        .then((data) => {
            if (data) {
                // TODO change
                req.session.uid = phoneFull
                res.redirect('/home')
                /// res.render('login/numberValidation', { name: data.name })
                /// smsSender.sendSMS(phoneFull).then((_v) => console.log(_v)).catch((err) => console.log(err.message))
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
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.verify = function (req, res) {
    let code = req.body.code;
    let userPhone = req.session.uid
    if (userPhone) {
        smsSender.verifySMS(userPhone, code).then(_verification => {
            if (_verification.status == 'approved') {
                res.status(200).end()
            }
            else {
                // req.session.destroy()
                res.status(406).end();
            }
        }).catch(_err => {
            // req.session.destroy()
            res.status(500).end()
        })
    }
    else {
        // req.session.destroy()
        res.status(403).end()
    }
}


/**
 * Function to resned SMS to the user for 2FA
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.resendCode = function (req, res) {
    let userPhone = req.session.uid
    if (userPhone) {
        smsSender.sendSMS(userPhone)
            .then((_ver) => { res.status(200).end(); console.log('sent') })
            // TODO destroy the session
            .catch((_errr) => { res.status(500).end(); console.log('sent') })
    }
    else {
        // req.session.destroy()
        res.status(403).end()
    }
}

/**
 * Function to handle user logout event
 * It destroys the session and redirect to home
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.logout = function (req, res) {
    req.session.destroy()
    res.redirect('/')
}
