const db = require('../../database')
const userModel = require('./user')


let isProduction = (process.env.NODE_ENV === 'production')

/**
 * Getting user's friends
 * @param {String} number - user's phone number. i.e `id`
 * @returns {Promise<Array<Object>>} Promise - Friends Array
 */
module.exports.getFriends = async function (number) {
    try {
        let params = [number]
        let output = await db.query('SELECT * FROM friendship WHERE (sender=$1 OR reciever=$1) AND status=1', params)
        let friends = []
        for (let friendship of output) {
            if (friendship.sender == number) {
                friends.push(await userModel.getUserInfoByNumber(friendship.reciever))
                continue
            }
            friends.push(await userModel.getUserInfoByNumber(friendship.sender))
        }
        return friends
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return null
        // throw err
    }
}


/**
 * Getting user's friendship requests
 * @param {String} number - user's phone number. i.e `id`
 * @returns {Promise<Array<Object>>} Promise - requests Array
 */
module.exports.getUserFriendRequests = async function (number) {
    try {
        let params = [number]
        let queryStr = "SELECT users.name as name, friendship.sender as number\
        FROM users INNER JOIN friendship\
        ON users.number=friendship.sender\
        and friendship.reciever=$1\
        and friendship.status=0"
        let requests = await db.query(queryStr, params)
        return requests
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return null
        // throw err
    }
}


/**
 * Getting a friendship request
 * @param {String} sender - sender phone number. i.e `id`
 * @param {String} reciever - reciever phone number. i.e `id`
 * @returns {Number} status
 */
module.exports.getRequest = async function (sender, reciever) {
    try {
        let params = [sender, reciever]
        let queryStr = "SELECT status FROM friendship WHERE sender=$1 and reciever=$2"
        let result = await db.query(queryStr, params)
        return result[0]
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return false
        // throw err
    }
}

/**
 * Sending a friendship request
 * @param {String} sender - sender phone number. i.e `id`
 * @param {String} reciever - reciever phone number. i.e `id`
 * @returns {boolean} boolean
 */
module.exports.insertRequest = async function (sender, reciever) {
    try {
        let params = [sender, reciever]
        let queryStr = "INSERT INTO friendship (sender, reciever, status) VALUES ($1, $2, 0)"
        await db.query(queryStr, params)
        return true
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return false
        // throw err
    }
}

/**
 * Set Request status as accepted
 * @param {String} user1 - user 1 phone number. i.e `id`
 * @param {String} user2 - user 2 phone number. i.e `id`
 * @returns {boolean} boolean
 */
module.exports.updateRequestStatus = async function (user1, user2) {
    try {
        let params = [user1, user2]
        let queryStr = "UPDATE friendship SET status=1 WHERE\
        (sender=$1 AND reciever=$2) OR(reciever=$1 AND sender=$2)"
        await db.query(queryStr, params)
        return true
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return false
        // throw err
    }
}

/**
 * Cancel (delete) friendship request
 * @param {String} user1 - user 1 phone number. i.e `id`
 * @param {String} user2 - user 2 phone number. i.e `id`
 * @returns {boolean} boolean
 */
module.exports.deleteRequest = async function (user1, user2) {
    try {
        let params = [user1, user2]
        let queryStr = "DELETE FROM friendship WHERE\
        (sender=$1 AND reciever=$2) OR(reciever=$1 AND sender=$2)"
        await db.query(queryStr, params)
        return true
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return false
        // throw err
    }
}