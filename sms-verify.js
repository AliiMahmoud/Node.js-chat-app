const twilio = require('twilio')

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const serviceID = process.env.SERVICE_ID

const client = twilio(accountSid, authToken)

/**
 * Function to send a **SMS** to a number using `TWILIO`
 * @param {String} number - user's number to send him a SMS  
 * @returns the verification status
 */
module.exports.sendSMS = function (number) {
    return client.verify.services(serviceID)
        .verifications.create({ to: number, channel: 'sms' })

}

/**
 * Function to verify the sent **SMS** to a number using `TWILIO`
 * @param {String} number - user's number to send him a SMS
 * @param {String} code - code sent to the user 
 * @returns the verification status
 */
module.exports.verifySMS = function (number, code) {
    return client.verify.services(serviceID)
        .verificationChecks
        .create({ to: number, code: code })

}


/**
 * Function to validate the numer using `TWILIO`
 * @param {String} number - user's number
 * @returns the verification status
 */
module.exports.validateNumber = async function (number) {
    try {
        let res = await client.lookups.v1.phoneNumbers(number).fetch()
        if (res)
            return true
        return false
    } catch (err) {
        return false
    }
}