// --- 1. Imports ---
const equipmentCategory = require("./equipment-category");
const user = require("./user");
const passwordReset = require("./password-reset");
const equipment = require("./equipment");
const maintenanceRequest = require("./maintenance-request");
const maintenanceTeam = require("./maintenance-team");
const teamMembers = require("./team-members");
const db = require("../config/db-connect");



// --- 2. Helper: Wrap db.query in a Promise ---
const runQuery = (sql, tableName) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
            if (err) {
                console.error(`❌ ${tableName} failed:`, err.message);
                reject(err);
            } else {
                console.log(`✅ ${tableName} created`);
                resolve();
            }
        });
    });
};

// --- 3. The Main Execution Function ---
const initDB = async () => {
    try {
        console.log("🚀 Starting Database Initialization...");

        // Dependency Level 1: Independent Tables
        await runQuery(user, "Users");
        await runQuery(maintenanceTeam, "Maintenance Team");

        // Password reset table depends on users
        await runQuery(passwordReset, "Password Resets");

        // Dependency Level 2: Depends on Users/Teams
        await runQuery(teamMembers, "Team Members");

        // Dependency Level 3: Depends on Members
        await runQuery(equipmentCategory, "Equipment Category");

        // Dependency Level 4: Depends on Category
        await runQuery(equipment, "Equipment");

        // Dependency Level 5: Depends on Equipment & Users
        await runQuery(maintenanceRequest, "Maintenance Request");

        console.log("🎉 All tables created successfully!");
    } catch (error) {
        console.error("⚠️ Database initialization stopped due to error.");
    } finally {
        // db.end(); // Close connection when done
    }
};

module.exports = { initDB };
