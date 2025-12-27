/*
categpry_name, categpry_id
team_id, techincian_id is team manager from team_memnber
*/
const db = require("../config/db-connect");

const createEquipmentCategoryTable = `
CREATE TABLE IF NOT EXISTS equipment_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,

    team_id INT NOT NULL,
    technician_id INT NOT NULL,   -- team manager from team_members

    FOREIGN KEY (team_id) REFERENCES maintenance_team(team_id),
    FOREIGN KEY (technician_id) REFERENCES users(user_id)
);
`;

module.exports = createEquipmentCategoryTable;
