const db = require('../config/db-connect');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from the verifyToken middleware
        const [users] = await db.execute(
            'SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?',
            [req.user.id]
        );

        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Users (For Admin Dropdowns)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT user_id, name, email FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From middleware
        const { name, email, password } = req.body;

        // 1. Validation: Check if email is already taken by ANOTHER user
        const [existing] = await db.query(
            'SELECT * FROM users WHERE email = ? AND user_id != ?',
            [email, userId]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email is already in use by another account.' });
        }

        // 2. Prepare Update Query
        let query = 'UPDATE users SET name = ?, email = ?';
        let params = [name, email];

        // 3. Handle Password Update (Only if provided)
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        // 4. Finalize Query
        query += ' WHERE user_id = ?';
        params.push(userId);

        await db.query(query, params);

        // 5. Return updated user info (excluding password)
        res.json({
            message: 'Profile updated successfully',
            user: { id: userId, name, email, is_admin: req.user.is_admin }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};