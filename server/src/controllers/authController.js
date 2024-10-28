// server/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authController = {
    // Register
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const [existingUsers] = await pool.query(
                'SELECT * FROM users WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    message: 'User already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const [result] = await pool.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            // Get the created user
            const [newUser] = await pool.query(
                'SELECT id, username, email, role FROM users WHERE id = ?',
                [result.insertId]
            );

            // Generate token
            const token = jwt.sign(
                { 
                    userId: newUser[0].id,
                    username: newUser[0].username,
                    email: newUser[0].email,
                    role: newUser[0].role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                token,
                user: newUser[0]
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error in registration' });
        }
    },

    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Get user
            const [users] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            const user = users[0];

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = jwt.sign(
                { 
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Remove password from user object
            delete user.password;

            res.json({
                token,
                user
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error in login' });
        }
    },

    // Verify token
    async verifyToken(req, res) {
        console.log('req -> ', req.user.userId)
        try {
            const [users] = await pool.query(
                'SELECT id, username, email, role FROM users WHERE id = ?',
                [req.user.userId] // Changed from req.user.id to req.user.userId
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json(users[0]);
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({ message: 'Error verifying token' });
        }
    },
    // Get current user
    async getCurrentUser(req, res) {
        try {
            const [users] = await pool.query(
                'SELECT id, username, email, role FROM users WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json(users[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update password
    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const [users] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const user = users[0];

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await pool.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, req.user.id]
            );

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;