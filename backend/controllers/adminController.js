const db = require("../config/db-connect");
const { initDB } = require("../models");

// POST /api/admin/reset - Drops tables and re-initializes schema
exports.resetDatabase = async (req, res) => {
    try {
        // Only admins reach here due to route middleware
        const dropOrder = [
            "maintenance_request",
            "equipment",
            "equipment_category",
            "team_members",
            "maintenance_team",
            "users"
        ];

        for (const table of dropOrder) {
            await new Promise((resolve, reject) => {
                db.query(`DROP TABLE IF EXISTS ${table}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        // Recreate tables
        await initDB();

        res.status(200).json({ message: "Database reset and initialized" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to reset database", error: err });
    }
};

exports.promoteUser = (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const sql = "UPDATE users SET is_admin = 1 WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User promoted to admin' });
    });
};