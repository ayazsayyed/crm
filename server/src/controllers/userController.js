// server/src/controllers/userController.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const userController = {
    async getUsers(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    id, 
                    username, 
                    email, 
                    role, 
                    created_at
                FROM users
                ORDER BY username
            `);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    },

    async getUserById(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    id, 
                    username, 
                    email, 
                    role, 
                    created_at
                FROM users 
                WHERE id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user details' });
        }
    },

    async getCurrentUser(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    id, 
                    username, 
                    email, 
                    role, 
                    created_at
                FROM users 
                WHERE id = ?
            `, [req.user.userId]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Get user's projects
            const [projects] = await pool.query(`
                SELECT DISTINCT p.* 
                FROM client_projects p
                INNER JOIN project_team pt ON p.id = pt.project_id
                WHERE pt.user_id = ?
            `, [req.user.userId]);

            // Get user's tasks
            const [tasks] = await pool.query(`
                SELECT * FROM project_tasks 
                WHERE assigned_to = ?
                ORDER BY due_date ASC
            `, [req.user.userId]);

            res.json({
                ...rows[0],
                projects,
                tasks
            });
        } catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    },

    async createUser(req, res) {
        try {
            const { username, email, password, role } = req.body;

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
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, role || 'user']
            );

            res.status(201).json({
                id: result.insertId,
                username,
                email,
                role: role || 'user'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Error creating user' });
        }
    },

    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;

            // Check if email is already taken by another user
            const [existingUsers] = await pool.query(
                'SELECT * FROM users WHERE email = ? AND id != ?',
                [email, req.user.userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    message: 'Email already in use'
                });
            }

            await pool.query(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, req.user.userId]
            );

            res.json({
                id: req.user.userId,
                username,
                email
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    },

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const [users] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [req.user.userId]
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
                [hashedPassword, req.user.userId]
            );

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Error changing password' });
        }
    },

    async updateUser(req, res) {
        try {
            const { username, email, role } = req.body;
            const userId = req.params.id;

            // Check if user exists
            const [existingUsers] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [userId]
            );

            if (existingUsers.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Check if email is taken by another user
            const [emailCheck] = await pool.query(
                'SELECT * FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );

            if (emailCheck.length > 0) {
                return res.status(400).json({
                    message: 'Email already in use'
                });
            }

            await pool.query(
                'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
                [username, email, role, userId]
            );

            res.json({
                id: userId,
                username,
                email,
                role
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    },

    async deleteUser(req, res) {
        try {
            // Check if user exists
            const [user] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [req.params.id]
            );

            if (user.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Delete user
            await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
};

module.exports = userController;