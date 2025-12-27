const db = require("../config/db-connect");

exports.createCategory = (req, res) => {
    const { category_name, team_id, technician_id } = req.body;

    // 1. Basic Validation
    if (!category_name || !team_id || !technician_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 2. LOGIC CHECK: Is this Technician actually in this Team?
    const checkMemberSql = "SELECT * FROM team_members WHERE team_id = ? AND user_id = ?";

    db.query(checkMemberSql, [team_id, technician_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(400).json({
                message: "Invalid assignment: The selected technician does not belong to this team."
            });
        }

        // 3. Insert the Category
        const insertSql = `
            INSERT INTO equipment_category (category_name, team_id, technician_id) 
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [category_name, team_id, technician_id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Category name already exists" });
                }
                return res.status(500).json({ message: "Database error", error: err });
            }
            res.status(201).json({
                message: "Category created successfully",
                categoryId: result.insertId
            });
        });
    });
};

exports.addEquipment = (req, res) => {
    // 1. Accept new fields matching your updated schema
    const { equipment_name, category_id, department, user_id, serial_number, location } = req.body;

    // 2. Validate required fields
    if (!equipment_name || !category_id) {
        return res.status(400).json({ message: "Equipment Name and Category ID are required" });
    }

    // 3. Prepare SQL with new fields
    const sql = `
        INSERT INTO equipment 
        (equipment_name, category_id, department, user_id, serial_number, location) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [equipment_name, category_id, department, user_id, serial_number, location], (err, result) => {
        if (err) {
            // Handle Duplicate Serial Number
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Serial Number already exists!" });
            }
            // Handle Invalid Category or User ID (Foreign Key Constraint)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: "Invalid Category ID or User ID provided." });
            }
            return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({
            message: "Equipment added successfully",
            equipmentId: result.insertId
        });
    });
};

exports.getAutoFillDetails = (req, res) => {
    const equipmentId = req.params.id;

    const sql = `
        SELECT 
            e.equipment_id,
            e.equipment_name,
            -- Get Category Details
            ec.category_id,
            ec.category_name,
            -- Get Team Details (Linked via Category)
            mt.team_id,
            mt.team_name,
            -- Get Default Technician (Manager)
            u.user_id AS technician_id,
            u.name AS technician_name
        FROM equipment e
        JOIN equipment_category ec ON e.category_id = ec.category_id 
        JOIN maintenance_team mt ON ec.team_id = mt.team_id 
        LEFT JOIN users u ON ec.technician_id = u.user_id
        WHERE e.equipment_id = ?
    `;

    db.query(sql, [equipmentId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        // Return the first (and only) result
        res.status(200).json(results[0]);
    });
};
