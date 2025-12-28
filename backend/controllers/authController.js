const db = require('../config/db-connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/backend-config');

// Signup Logic
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert User (Default is_admin = FALSE)
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // 4. Generate Token
        const token = jwt.sign(
            { id: result.insertId, is_admin: false }, // FLAG: Default role is false
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ token, user: { id: result.insertId, name, email, is_admin: false } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = users[0];

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // 3. Generate Token
        const token = jwt.sign(
            { id: user.user_id, is_admin: user.is_admin }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // FLAG: Send back user info so frontend can store it in localStorage
        res.json({
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};