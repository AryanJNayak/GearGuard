const createEquipmentTable = `
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    department VARCHAR(100),
    user_id INT,
    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES equipment_category(category_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);
`;

module.exports = createEquipmentTable;