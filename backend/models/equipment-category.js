const createEquipmentCategoryTable = `
CREATE TABLE IF NOT EXISTS equipment_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    team_id INT NOT NULL,
    technician_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (team_id) REFERENCES maintenance_team(team_id)
        ON DELETE CASCADE,

    FOREIGN KEY (technician_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
`;

module.exports = createEquipmentCategoryTable;