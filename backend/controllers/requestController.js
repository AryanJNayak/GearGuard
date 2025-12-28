const db = require('../config/db-connect');

// 1. Create Request (Unchanged)
exports.createRequest = async (req, res) => {
    try {
        const {
            equipment_id, category_id, maintenance_for, technician_id,
            subject, description, priority, request_type, schedule_date, duration
        } = req.body;
        const created_by = req.user.id;

        await db.execute(
            `INSERT INTO maintenance_request 
            (equipment_id, category_id, maintenance_for, technician_id, created_by, subject, description, priority, request_type, schedule_date, duration, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
            [equipment_id || null, category_id, maintenance_for || 'Equipment', technician_id, created_by, subject, description, priority || 'Medium', request_type || 'Corrective', schedule_date || null, duration || 0.0]
        );
        res.status(201).json({ message: 'Maintenance request created successfully' });
    } catch (error) {
        console.error("Create Request Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. Get User Related Requests (Smart Filter)
// Returns requests if: User Created It OR User is in the Assigned Team
exports.getTeamRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        // COMPLEX QUERY:
        // 1. Joins Request -> Category -> Team -> Member (to check team access)
        // 2. Checks if the current user is a manager of that team (tm.team_manager)
        // 3. Filters: created_by = Me OR I am in the team
        const [requests] = await db.execute(`
            SELECT DISTINCT
                r.*, 
                e.equipment_name, 
                ec.category_name,
                mt.team_name,
                t.name as technician_name,
                c.name as created_by_name,
                -- Flag: Is the current viewer a member of the assigned team?
                CASE WHEN tm.user_id IS NOT NULL THEN 1 ELSE 0 END as viewer_is_team_member,
                -- Flag: Is the current viewer the MANAGER of the assigned team?
                CASE WHEN tm.team_manager = 1 THEN 1 ELSE 0 END as viewer_is_manager
            FROM maintenance_request r
            LEFT JOIN equipment e ON r.equipment_id = e.equipment_id
            LEFT JOIN equipment_category ec ON r.category_id = ec.category_id
            LEFT JOIN maintenance_team mt ON ec.team_id = mt.team_id
            -- Join checks if CURRENT USER is in the assigned team
            LEFT JOIN team_members tm ON mt.team_id = tm.team_id AND tm.user_id = ?
            LEFT JOIN users t ON r.technician_id = t.user_id
            JOIN users c ON r.created_by = c.user_id
            WHERE 
                r.created_by = ?   -- Logic: I created it
                OR 
                tm.user_id IS NOT NULL -- Logic: Or I am in the team
            ORDER BY r.created_at DESC
        `, [userId, userId]);

        res.json(requests);
    } catch (error) {
        console.error("Get Requests Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. Admin View (Unchanged - Admins see all)
exports.getAllRequests = async (req, res) => {
    try {
        const [requests] = await db.execute(`
            SELECT 
                r.*, e.equipment_name, ec.category_name, t.name as technician_name, c.name as created_by_name,
                1 as viewer_is_manager, -- Admins are treated as managers
                1 as viewer_is_team_member
            FROM maintenance_request r
            LEFT JOIN equipment e ON r.equipment_id = e.equipment_id
            LEFT JOIN equipment_category ec ON r.category_id = ec.category_id
            LEFT JOIN users t ON r.technician_id = t.user_id
            JOIN users c ON r.created_by = c.user_id
            ORDER BY r.created_at DESC
        `);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. Update Status (Strict Manager Check)
exports.updateStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const userId = req.user.id;
        const isAdmin = req.user.is_admin;

        // 1. Verify Permission: Is User a Manager of the Team assigned to this Request?
        // We join Request -> Category -> Team -> Team Members
        const [authCheck] = await db.execute(`
            SELECT 1 
            FROM maintenance_request r
            JOIN equipment_category ec ON r.category_id = ec.category_id
            JOIN team_members tm ON ec.team_id = tm.team_id
            WHERE r.request_id = ? 
            AND tm.user_id = ? 
            AND tm.team_manager = 1
        `, [requestId, userId]);

        // Access Rule: Must be Admin OR Verified Team Manager
        if (!isAdmin && authCheck.length === 0) {
            return res.status(403).json({
                message: 'Permission denied: Only the Team Manager can update the status.'
            });
        }

        // 2. Perform Update
        await db.execute(
            'UPDATE maintenance_request SET status = ? WHERE request_id = ?',
            [status, requestId]
        );

        res.json({ message: `Status updated to ${status}` });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.is_admin;

        let query;
        let params = [];

        if (isAdmin) {
            // Admin sees ALL global stats
            query = `
                SELECT 
                    SUM(CASE WHEN status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as pending_requests,
                    -- FIX: Added 'r.' before technician_id to remove ambiguity
                    SUM(CASE WHEN r.technician_id = ? AND status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as my_tasks,
                    SUM(CASE WHEN priority = 'Critical' AND status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as critical_issues
                FROM maintenance_request r
            `;
            params = [userId];
        } else {
            // Regular User/Manager
            query = `
                SELECT 
                    SUM(CASE WHEN status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as pending_requests,
                    -- FIX: Added 'r.' before technician_id to remove ambiguity
                    SUM(CASE WHEN r.technician_id = ? AND status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as my_tasks,
                    SUM(CASE WHEN priority = 'Critical' AND status IN ('New', 'In Progress') THEN 1 ELSE 0 END) as critical_issues
                FROM maintenance_request r
                LEFT JOIN equipment_category ec ON r.category_id = ec.category_id
                LEFT JOIN team_members tm ON ec.team_id = tm.team_id AND tm.user_id = ?
                WHERE 
                    r.created_by = ? 
                    OR 
                    tm.user_id IS NOT NULL 
            `;
            params = [userId, userId, userId];
        }

        const [stats] = await db.execute(query, params);

        const result = stats[0] || { pending_requests: 0, my_tasks: 0, critical_issues: 0 };

        res.json({
            pending: Number(result.pending_requests) || 0,
            my_tasks: Number(result.my_tasks) || 0,
            critical: Number(result.critical_issues) || 0
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};