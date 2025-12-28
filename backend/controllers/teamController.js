const db = require('../config/db-connect');

// Create a new Maintenance Team
exports.createTeam = async (req, res) => {
    try {
        const { team_name } = req.body;
        if (!team_name) return res.status(400).json({ message: 'Team name is required' });

        const [result] = await db.execute(
            'INSERT INTO maintenance_team (team_name) VALUES (?)',
            [team_name]
        );
        res.status(201).json({ message: 'Team created', teamId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Team name already exists' });
        }
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Add Member to Team (Handles Manager Logic)
exports.addTeamMember = async (req, res) => {
    const { team_id, user_id, is_manager } = req.body;

    // Start a transaction for data integrity
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check if user is already in this team
        const [existingMember] = await connection.execute(
            'SELECT * FROM team_members WHERE team_id = ? AND user_id = ?',
            [team_id, user_id]
        );

        if (existingMember.length > 0) {
            // Update existing member role
            await connection.execute(
                'UPDATE team_members SET team_manager = ? WHERE team_id = ? AND user_id = ?',
                [is_manager, team_id, user_id]
            );
        } else {
            // 2. Logic: If adding a NEW manager, demote the existing one first
            if (is_manager) {
                await connection.execute(
                    'UPDATE team_members SET team_manager = 0 WHERE team_id = ? AND team_manager = 1',
                    [team_id]
                );
            }

            // 3. Insert new member
            await connection.execute(
                'INSERT INTO team_members (team_id, user_id, team_manager) VALUES (?, ?, ?)',
                [team_id, user_id, is_manager]
            );
        }

        await connection.commit();
        res.json({ message: 'Team member updated successfully' });

    } catch (error) {
        await connection.rollback();
        console.error("Add Member Error:", error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
};

// Get All Teams
exports.getAllTeams = async (req, res) => {
    try {
        const [teams] = await db.execute('SELECT * FROM maintenance_team');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Members of a Specific Team
exports.getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;
        const [members] = await db.execute(`
            SELECT u.user_id, u.name, u.email, tm.team_manager 
            FROM team_members tm
            JOIN users u ON tm.user_id = u.user_id
            WHERE tm.team_id = ?
        `, [teamId]);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};