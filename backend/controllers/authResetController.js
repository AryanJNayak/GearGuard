const db = require('../config/db-connect');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// POST /api/auth/forgot
exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // 1. Find user
    db.query('SELECT user_id, email FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        // 2. Create token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString().slice(0, 19).replace('T', ' '); // 1 hour

        const sql = 'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)';
        db.query(sql, [user.user_id, token, expiresAt], (err) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            // In production we would email the token link. For now return token so it can be used in dev/testing.
            res.status(200).json({ message: 'Password reset token created', token, expiresAt });
        });
    });
};

// POST /api/auth/reset
exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and newPassword are required' });

    const sql = 'SELECT id, user_id, expires_at FROM password_resets WHERE token = ?';
    db.query(sql, [token], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Invalid token' });

        const row = results[0];
        const expires = new Date(row.expires_at);
        if (expires < new Date()) return res.status(400).json({ message: 'Token expired' });

        // Hash password and update user
        const hashed = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashed, row.user_id], (err) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            // delete the token record
            db.query('DELETE FROM password_resets WHERE id = ?', [row.id], (err) => {
                if (err) console.error('Failed to delete token', err);
            });

            res.status(200).json({ message: 'Password reset successful' });
        });
    });
};