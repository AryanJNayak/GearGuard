const db = require('../config/db-connect');

// Ensure these files export the raw SQL string (e.g. module.exports = "CREATE TABLE...";)
const userTable = require('./user');
const maintenanceTeamTable = require('./maintenance-team');
const passwordResetTable = require('./password-reset');
const teamMembersTable = require('./team-members');
const equipmentCategoryTable = require('./equipment-category');
const equipmentTable = require('./equipment');
const maintenanceRequestTable = require('./maintenance-request');

// FIX: Removed "new Promise" wrapper and callback. Used direct "await".
const runQuery = async (sql, tableName) => {
    try {
        await db.query(sql); // logic: db.query() returns a promise automatically
        console.log(`✅ ${tableName} created successfully`);
    } catch (err) {
        console.error(`❌ ${tableName} failed:`, err.message);
        throw err; // Stop the process if a table fails
    }
};

const initDB = async () => {
    try {
        console.log('🚀 Starting Database Initialization...\n');

        // Level 1: Independent tables
        await runQuery(userTable, 'Users Table');
        await runQuery(maintenanceTeamTable, 'Maintenance Team Table');

        // Level 2: Depends on users
        await runQuery(passwordResetTable, 'Password Resets Table');

        // Level 3: Depends on users and teams
        await runQuery(teamMembersTable, 'Team Members Table');

        // Level 4: Depends on teams and users
        await runQuery(equipmentCategoryTable, 'Equipment Category Table');

        // Level 5: Depends on category and users
        await runQuery(equipmentTable, 'Equipment Table');

        // Level 6: Depends on equipment, users, and category
        await runQuery(maintenanceRequestTable, 'Maintenance Request Table');

        console.log('\n🎉 All tables created successfully!');
    } catch (error) {
        console.error('\n⚠️ Database initialization stopped due to error');
        process.exit(1);
    }
};

module.exports = { initDB };