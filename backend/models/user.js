/*
name, password, email, isadmin(bool)
*/
const db = require("../config/db-connect");

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);
`;

module.exports = createUserTable;
// db.query(createUserTable, (err) => {
//     if (err) {
//         console.error("❌ Users table creation failed:", err);
//     } else {
//         console.log("✅ Users table created successfully");
//     }
//     db.end();
// });