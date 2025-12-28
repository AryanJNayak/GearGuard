const db = require('../config/db-connect');
const { initDB } = require('../models/index');

const resetDatabase = async () => {
    try {
        console.log("⏳ Dropping tables...");
        // Use db.query instead of db.execute for DDL statements
        await db.query('DROP TABLE IF EXISTS password_resets');
        await db.query('DROP TABLE IF EXISTS maintenance_request');
        await db.query('DROP TABLE IF EXISTS equipment');
        await db.query('DROP TABLE IF EXISTS equipment_category');
        await db.query('DROP TABLE IF EXISTS team_members');
        await db.query('DROP TABLE IF EXISTS maintenance_team');
        await db.query('DROP TABLE IF EXISTS users');

        console.log("🗑️  All tables dropped.");

        // Re-initialize the database
        await initDB();

        console.log("✅ Database reset complete.");
        process.exit();
    } catch (error) {
        console.error("❌ Failed to reset DB Error:", error.message);
        process.exit(1);
    }
};

resetDatabase();