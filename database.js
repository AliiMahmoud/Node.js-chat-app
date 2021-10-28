// Importing postgres connection pool
const { Pool } = require('pg');

var pool;

/**
 * Connect to database using the pool
 * takes the configurations from the environment variables
 * @see https://node-postgres.com/features/pooling
 */
module.exports.connect = function () {
    // Connecting to the database
    pool = new Pool({
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    });
}

/**
 * Query the database using the pool
 * @param {String} query 
 * @param {Array<String>} params 
 * @returns {Promise} promise
 * 
 * @see https://node-postgres.com/features/pooling#single-query
 */
module.exports.query = async function (query, params) {
    let data = await pool.query(query, params)
    return data.rows
}
