//team-name(IT, Machenics), team-id(unique)

const db = require("../config/db-connect");

const createMaintenanceTeamTable = `
CREATE TABLE IF NOT EXISTS maintenance_team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL UNIQUE
);
`;

module.exports = createMaintenanceTeamTable;
