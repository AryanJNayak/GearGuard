const mysql = require("mysql2");
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = require('./backend-config');


// const mysql = require('mysql2');
require('dotenv').config({ path: './config/.env' }); // FLAG: Ensure .env path is correct

// FLAG: Update these credentials in your .env file
const pool = mysql.createPool({
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD || '', // FLAG: Add your MySQL password here
    database: DB_NAME || 'gearguard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to promise-based for cleaner async/await syntax in controllers
const promisePool = pool.promise();

module.exports = promisePool;