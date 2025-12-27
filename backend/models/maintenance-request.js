/*
equpiment * equipment-category +

schedule_date, duration, priority, 
*/
const db = require("../config/db-connect");

/*
  Requirements:
  1. schedule_date, duration, priority (Requested by you)
  2. equipment_id (Links to Equipment table)
  3. technician_id (Assigned User)
  4. request_type (Corrective vs Preventive - from PDF)
  5. status (New, In Progress, Repaired, Scrap - from PDF)
*/

const createMaintenanceRequestTable = `
CREATE TABLE IF NOT EXISTS maintenance_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Core Links
    equipment_id INT NOT NULL,
    technician_id INT, -- Nullable initially, assigned later by Manager/Self

    -- Request Details
    subject VARCHAR(255) NOT NULL, -- e.g., "Leaking Oil" [cite: 31]
    description TEXT,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    
    -- Workflow & Timing
    request_type ENUM('Corrective', 'Preventive') NOT NULL DEFAULT 'Corrective',
    status ENUM('New', 'In Progress', 'Repaired', 'Scrap') DEFAULT 'New',
    
    schedule_date DATE,
    duration FLOAT DEFAULT 0.0, -- Hours spent on repair 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
        ON DELETE CASCADE,

    FOREIGN KEY (technician_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);
`;



module.exports = createMaintenanceRequestTable;