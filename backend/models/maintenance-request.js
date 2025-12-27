/*
equpiment * equipment-category +

schedule_date, duration, priority, 
*/

/*
  Requirements:
  1. schedule_date, duration, priority (Requested by you)
  2. equipment_id (Links to Equipment table)
  3. technician_id (Assigned User)
  4. request_type (Corrective vs Preventive - from PDF)
  5. status (New, In Progress, Repaired, Scrap - from PDF)
*/
const db = require("../config/db-connect");

const createMaintenanceRequestTable = `
CREATE TABLE IF NOT EXISTS maintenance_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,

    -- Allow nullable equipment to support 'Workplace' maintenance
    equipment_id INT,
    category_id INT,
    maintenance_for ENUM('Equipment','Workplace') DEFAULT 'Equipment',
    technician_id INT,

    -- Track who created the ticket
    created_by INT NOT NULL,

    -- Request Details
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',

    -- Workflow & Timing
    request_type ENUM('Corrective', 'Preventive') NOT NULL DEFAULT 'Corrective',
    status ENUM('New', 'In Progress', 'Repaired', 'Scrap') DEFAULT 'New',

    schedule_date DATE,
    duration FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    -- Foreign Keys
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