const createMaintenanceTeamTable = `
CREATE TABLE IF NOT EXISTS maintenance_team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = createMaintenanceTeamTable;