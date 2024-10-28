// server/src/controllers/projectController.js
const pool = require('../config/database');

const projectController = {
    // Get all projects
    async getAll(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT p.*, c.company_name as client_name 
                FROM projects p 
                LEFT JOIN clients c ON p.client_id = c.id 
                ORDER BY p.created_at DESC
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single project
    async getOne(req, res) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM projects WHERE id = ?',
                [req.params.id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create project
    async create(req, res) {
        try {
            const { name, description, client_id, status, start_date, end_date, budget } = req.body;
            const [result] = await pool.query(
                'INSERT INTO projects (name, description, client_id, status, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, description, client_id, status, start_date, end_date, budget]
            );
            res.status(201).json({ id: result.insertId, ...req.body });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update project
    async update(req, res) {
        try {
            const { name, description, client_id, status, start_date, end_date, budget } = req.body;
            await pool.query(
                'UPDATE projects SET name = ?, description = ?, client_id = ?, status = ?, start_date = ?, end_date = ?, budget = ? WHERE id = ?',
                [name, description, client_id, status, start_date, end_date, budget, req.params.id]
            );
            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete project
    async delete(req, res) {
        try {
            await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = projectController;