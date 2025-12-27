const db = require("../config/db-connect");

exports.createTeam = (req, res) => {
    const { team_name } = req.body;

    if (!team_name) {
        return res.status(400).json({ message: "Team name is required" });
    }

    const sql = "INSERT INTO maintenance_team (team_name) VALUES (?)";

    db.query(sql, [team_name], (err, result) => {
        if (err) {
            // Handle duplicate team names
            if (err.code === 'ER_DUP_ENTRY') {
                console.log("Team name already exists")

                return res.status(400).json({ message: "Team name already exists" });
            }
            return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("Team created successfully!")
        res.status(201).json({ message: "Team created successfully!", teamId: result.insertId });
    });
};


exports.addTeamMember = (req, res) => {
    const { team_id, user_id, is_manager } = req.body;

    // 1. Validate Input
    if (!team_id || !user_id) {
        return res.status(400).json({ message: "Team ID and User ID are required" });
    }

    // 2. LOGIC CHECK: If trying to add a Manager, check if one already exists
    if (is_manager) {
        const checkManagerSql = "SELECT * FROM team_members WHERE team_id = ? AND team_manager = 1";

        db.query(checkManagerSql, [team_id], (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Operation Failed: This team already has a Manager assigned."
                });
            }

            // If no manager exists, proceed to insert
            insertMember();
        });
    } else {
        // If adding a normal technician, skip the check
        insertMember();
    }

    // Helper function to perform the actual insert
    function insertMember() {
        const sql = `
            INSERT INTO team_members (team_id, user_id, team_manager) 
            VALUES (?, ?, ?)
        `;

        const managerRole = is_manager ? 1 : 0;

        db.query(sql, [team_id, user_id, managerRole], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "User is already a member of this team" });
                }
                return res.status(500).json({ message: "Database error", error: err });
            }

            res.status(201).json({
                message: "Member added successfully",
                role: managerRole ? "Manager" : "Technician"
            });
        });
    }
};


// 1. Get all basic teams
exports.getAllTeams = (req, res) => {
    const sql = "SELECT * FROM maintenance_team";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};

// 2. Get all members with their Team Names and User Names
exports.getAllMembers = (req, res) => {
    const sql = `
        SELECT 
            t.team_name, 
            u.name AS technician_name, 
            u.email,
            tm.team_manager 
        FROM team_members tm
        JOIN maintenance_team t ON tm.team_id = t.team_id
        JOIN users u ON tm.user_id = u.user_id
        ORDER BY t.team_name ASC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};

// 3. Get members of a SPECIFIC team by ID
exports.getMembersByTeamId = (req, res) => {
    const teamId = req.params.teamId; // Get ID from URL

    const sql = `
        SELECT 
            u.user_id, 
            u.name, 
            u.email, 
            tm.team_manager 
        FROM team_members tm
        JOIN users u ON tm.user_id = u.user_id
        WHERE tm.team_id = ?
    `;

    db.query(sql, [teamId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No members found for this team" });
        }
        res.status(200).json(results);
    });
};

