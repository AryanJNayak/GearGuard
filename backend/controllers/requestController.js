const db = require("../config/db-connect");

exports.createRequest = (req, res) => {
    const {
        equipment_id,
        technician_id,
        subject,
        description,
        priority,
        request_type,
        schedule_date,
        user_id
    } = req.body;

    // 1. Get the ID of the logged-in user from the Token (Middleware puts this here)
    const createdByUserId = user_id;

    if (!equipment_id || !subject || !createdByUserId) {
        console.log(createdByUserId)
        return res.status(400).json({ message: "Equipment ID and Subject are required." });
    }

    // 2. Insert with created_by field
    const sql = `
        INSERT INTO maintenance_request 
        (equipment_id, technician_id, created_by, subject, description, priority, request_type, schedule_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        equipment_id,
        technician_id || null,
        createdByUserId, // <--- Automatically inserted here
        subject,
        description || null,
        priority || 'Medium',
        request_type || 'Corrective',
        schedule_date || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: "Invalid Equipment ID or Technician ID." });
            }
            return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({
            message: "Maintenance request created successfully",
            requestId: result.insertId,
            createdBy: createdByUserId
        });
    });
};


exports.getAllRequests = (req, res) => {
    const sql = "SELECT * FROM maintenance_request ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};

exports.getTeamRequests = (req, res) => {

    const userId = req.params.user_id;

    const sql = `
        SELECT 
            mr.request_id,
            mr.subject,
            mr.priority,
            mr.status,
            mr.created_at,
            e.equipment_name,
            ec.category_name,
            mt.team_name
        FROM maintenance_request mr
        JOIN equipment e ON mr.equipment_id = e.equipment_id
        JOIN equipment_category ec ON e.category_id = ec.category_id
        JOIN maintenance_team mt ON ec.team_id = mt.team_id
        WHERE mt.team_id IN (
            SELECT team_id FROM team_members WHERE user_id = ?
        )
        ORDER BY mr.created_at DESC;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};

exports.updateStatus = (req, res) => {

    const { status, requestId } = req.body;

    // 1. Validate Status (Must match your Database ENUM)
    const validStatuses = ['New', 'In Progress', 'Repaired', 'Scrap'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status. Allowed values: " + validStatuses.join(", ")
        });
    }

    // 2. Update the Database
    const sql = "UPDATE maintenance_request SET status = ? WHERE request_id = ?";

    db.query(sql, [status, requestId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: `Status updated to '${status}' successfully.` });
    });
};