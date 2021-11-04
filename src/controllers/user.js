const userModel = require('../models/user')
const friendshipModel = require('../models/friendship')

/**
 * Middleware Function to handle requesting the home page
 * @summary if the user is authenticated it renders home page if not redirect
 *  the user to login
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.home = async function (req, res) {
    if (!req.session.uid) { res.redirect('/'); return; }
    // Authenticated
    let requests = await friendshipModel.getUserFriendRequests(req.session.uid)
    res.render('home', { requests })
}

/**
 * Function for getting user's friends
 * @param {String} number - user's number(ID)
 * @returns {Promise<Array>} Friends : array of Objects
 */
module.exports.getUserFriends = async function (number) {
    // Getting friends from database
    let friends = await friendshipModel.getFriends(number)
    return friends
}


/**
 * Function for searching for a user by his number
 * @param {String} number - user's number(ID)
 * @returns {Promise<{}>} user : Objects
 */
module.exports.searchForUser = async function (myNumber, number) {
    // Getting friends from database
    let user = await userModel.getUserInfoByNumber(number)

    // Getting request info if exists
    if (user) {
        // Searching for myself
        if (user.number == myNumber)
            return { user, status: -2, sent: null }

        // seching for person i already sent him a request or a friend
        let sentRequest = await friendshipModel.getRequest(myNumber, number)
        if (sentRequest)
            return { user, status: sentRequest.status, sent: true }

        // seching for person i in my request list or a friend
        let recievedRequest = await friendshipModel.getRequest(number, myNumber)
        if (recievedRequest)
            return { user, status: recievedRequest.status, sent: false }

        // Not a friend
        return { user, status: -1, sent: null }
    }
    return null
}

/**
 * Function accept user's friendship request
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 * @returns
 */
module.exports.acceptRequest = async function (req, res) {
    if (!req.session.uid) { res.redirect('/'); return }
    // authenticated
    // TODO check
    let sender = req.session.uid
    let reciever = req.params.reciever
    await friendshipModel.updateRequestStatus(sender, reciever)
    res.redirect('/home')
}


/**
 * Function send to user friendship request
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 * @returns
 */
module.exports.sendRequest = async function (req, res) {
    if (!req.session.uid) { res.redirect('/'); return }
    // authenticated
    let sender = req.session.uid
    let reciever = req.params.reciever
    if (sender == reciever)
        res.redirect('/home')
    await friendshipModel.insertRequest(sender, reciever)
    res.redirect('/home')
}



/**
 * Function reject user's friendship request
 * @param {import('express').Request} req - express Request handler Object
 * @param {import('express').Response} res - express Response Object
 */
module.exports.rejectRequest = async function (req, res) {
    if (!req.session.uid) { res.redirect('/'); return }
    // authenticated
    let sender = req.session.uid
    let reciever = req.params.reciever
    await friendshipModel.deleteRequest(sender, reciever)
    res.redirect('/home')
}


