const db = require("../config/db-connect");

// id INT AUTO_INCREMENT PRIMARY KEY,

const createTeamMembersTable = `
CREATE TABLE IF NOT EXISTS team_members (

    team_id INT NOT NULL,

    user_id INT NOT NULL,

    team_manager BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (team_id) REFERENCES maintenance_team(team_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    UNIQUE(team_id, user_id)
);
`;

module.exports = createTeamMembersTable;
