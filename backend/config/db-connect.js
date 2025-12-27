const mysql = require("mysql2");
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = require('./backend-config');
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Failed:", err);
        return;
    }
    console.log("MySQL Connected");
});

module.exports = db;