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

// GET /api/users/me
exports.getProfile = (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(403).json({ message: 'Not authenticated' });

    const sql = 'SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(results[0]);
    });
};

// PUT /api/users/me
exports.updateProfile = (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(403).json({ message: 'Not authenticated' });

    const { name, email } = req.body;
    if (!name && !email) return res.status(400).json({ message: 'Nothing to update' });

    const sql = 'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE user_id = ?';
    db.query(sql, [name || null, email || null, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already in use' });
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Profile updated' });
    });
};