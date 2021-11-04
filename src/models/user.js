const db = require('../../database')

let isProduction = (process.env.NODE_ENV === 'production')

/**
 * Getting a user form the database `postgres`
 * @param {String} number - user's phone number
 * @param {String} password - user's hash
 * @returns {Promise<Object>} Promise - user Object if exists
 */
module.exports.getUser = async function (number, password) {
    try {
        let params = [number, password]
        let user = await db.query('SELECT * FROM users WHERE number=$1 AND hash=$2', params)
        return user[0]
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return null
        // throw err
    }
}

/**
 * Inserting a user in the database `postgres`
 * @param {String} name - user's name
 * @param {String} number - user's phone number
 * @param {String} password - user's hash
 * @returns {Promise<Object>} Promise - user Object if inserted
 */
module.exports.insertUser = async function (name, number, password) {
    try {
        let params = [name, number, password]
        // RETURNING * => to return the inserted row
        let user = await db.query('insert into users (name, number, hash) values ($1, $2, $3) RETURNING *', params)
        return user[0]
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return null
        // throw err
    }
}


/**
 * Getting user's information using his/her number
 * @param {String} number - user's phone number. i.e `id`
 * @returns {Promise<Object>} Promise - user object
 */
 module.exports.getUserInfoByNumber = async function (number) {
    try {
        let params = [number]
        let output = await db.query('SELECT name, number FROM users WHERE number = $1', params)
        return output[0]
    }
    catch (err) {
        if (!isProduction)
            console.log(err.stack);
        return null
        // throw err
    }
}