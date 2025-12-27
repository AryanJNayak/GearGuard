const db = require('../config/db-connect');
const { initDB } = require('../models');

(async () => {
    try {
        console.log('Dropping tables...');
        const dropOrder = [
            'maintenance_request',
            'equipment',
            'equipment_category',
            'team_members',
            'maintenance_team',
            'users'
        ];

        for (const t of dropOrder) {
            await new Promise((resolve, reject) => db.query(`DROP TABLE IF EXISTS ${t}`, (err) => err ? reject(err) : resolve()));
        }

        console.log('Reinitializing DB...');
        await initDB();
        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error('Failed to reset DB', err);
        process.exit(1);
    }
})();