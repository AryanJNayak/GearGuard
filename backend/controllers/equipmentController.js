const db = require('../config/db-connect');

// Create Equipment Category
exports.createCategory = async (req, res) => {
    try {
        const { category_name, team_id, technician_id } = req.body;

        // FLAG: Validate that the default technician actually belongs to the assigned team
        const [validTech] = await db.execute(
            'SELECT * FROM team_members WHERE team_id = ? AND user_id = ?',
            [team_id, technician_id]
        );

        if (validTech.length === 0) {
            return res.status(400).json({ message: 'Selected technician is not in the assigned team' });
        }

        await db.execute(
            'INSERT INTO equipment_category (category_name, team_id, technician_id) VALUES (?, ?, ?)',
            [category_name, team_id, technician_id]
        );

        res.status(201).json({ message: 'Category created' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get All Categories (for dropdowns)
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.execute(`
            SELECT ec.category_id, ec.category_name, mt.team_name, u.name as technician_name
            FROM equipment_category ec
            JOIN maintenance_team mt ON ec.team_id = mt.team_id
            JOIN users u ON ec.technician_id = u.user_id
        `);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add New Equipment
exports.addEquipment = async (req, res) => {
    try {
        const { equipment_name, category_id, department, user_id, serial_number, location } = req.body;

        await db.execute(
            `INSERT INTO equipment 
            (equipment_name, category_id, department, user_id, serial_number, location) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [equipment_name, category_id, department, user_id || null, serial_number, location]
        );

        res.status(201).json({ message: 'Equipment added successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Serial number must be unique' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const [equipment] = await db.execute(`
            SELECT e.*, ec.category_name, u.name as assigned_user
            FROM equipment e
            JOIN equipment_category ec ON e.category_id = ec.category_id
            LEFT JOIN users u ON e.user_id = u.user_id
        `);
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// KEY FEATURE: Get Auto-Fill Details for Requests
// Logic: User selects Equipment -> System fetches Category, Team, and Default Technician
exports.getAutoFillDetails = async (req, res) => {
    try {
        const { id } = req.params; // Equipment ID

        const [rows] = await db.execute(`
            SELECT 
                e.category_id,
                ec.category_name,
                ec.team_id,
                mt.team_name,
                ec.technician_id,
                u.name as technician_name
            FROM equipment e
            JOIN equipment_category ec ON e.category_id = ec.category_id
            JOIN maintenance_team mt ON ec.team_id = mt.team_id
            JOIN users u ON ec.technician_id = u.user_id
            WHERE e.equipment_id = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Equipment not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};