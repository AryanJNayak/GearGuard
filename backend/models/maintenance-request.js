const createMaintenanceRequestTable = `
CREATE TABLE IF NOT EXISTS maintenance_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    category_id INT,
    maintenance_for ENUM('Equipment', 'Workplace') DEFAULT 'Equipment',
    technician_id INT,
    created_by INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    request_type ENUM('Corrective', 'Preventive') DEFAULT 'Corrective',
    status ENUM('New', 'In Progress', 'Repaired', 'Scrap') DEFAULT 'New',
    schedule_date DATE,
    duration FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
        ON DELETE SET NULL,

    FOREIGN KEY (technician_id) REFERENCES users(user_id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id) REFERENCES equipment_category(category_id)
        ON DELETE SET NULL
);
`;

module.exports = createMaintenanceRequestTable;