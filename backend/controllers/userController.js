const db = require("../config/db-connect");

exports.getAllUsers = (req, res) => {
    // Select everything EXCEPT the password
    const sql = "SELECT user_id, name, email, is_admin FROM users";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};