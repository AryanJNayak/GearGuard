/*

id, equipment_name, category, emp_name

id -> equipment_category & maintanence_team
*/

const db = require("../config/db-connect");

/*
  Requirements based on your prompt:
  1. id (Primary Key)
  2. equipment_name
  3. category (Foreign Key -> equipment_category table)
  4. emp_name (Owner/Employee)

  Note: The PDF also lists Serial Number, Warranty, and Location as key fields[cite: 16, 17, 18].
  I have added 'serial_number' and 'location' as optional fields below if you wish to uncomment them later.
*/

const createEquipmentTable = `
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,

    -- Foreign Key linking to the equipment_category table
    category_id INT NOT NULL,

    -- NEW: Department (e.g., "Production", "HR", "Sales")
    department VARCHAR(100),

    -- NEW: Replaces 'employee_name'. Links to a specific registered user.
    user_id INT,

    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(100),

    -- Constraints
    FOREIGN KEY (category_id) REFERENCES equipment_category(category_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);
`;

module.exports = createEquipmentTable;


