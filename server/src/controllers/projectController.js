// server/src/controllers/projectController.js
const pool = require('../config/database');

// const projectController = {
//     // Get all projects
//     async getAll(req, res) {
//         try {
//             const [rows] = await pool.query(`
//                 SELECT p.*, c.company_name as client_name 
//                 FROM projects p 
//                 LEFT JOIN clients c ON p.client_id = c.id 
//                 ORDER BY p.created_at DESC
//             `);
//             res.json(rows);
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },

//     // Get single project
//     async getOne(req, res) {
//         try {
//             const [rows] = await pool.query(
//                 'SELECT * FROM projects WHERE id = ?',
//                 [req.params.id]
//             );
//             if (rows.length === 0) {
//                 return res.status(404).json({ message: 'Project not found' });
//             }
//             res.json(rows[0]);
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },

//     // Create project
//     async create(req, res) {
//         try {
//             const { name, description, client_id, status, start_date, end_date, budget } = req.body;
//             const [result] = await pool.query(
//                 'INSERT INTO projects (name, description, client_id, status, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                 [name, description, client_id, status, start_date, end_date, budget]
//             );
//             res.status(201).json({ id: result.insertId, ...req.body });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },

//     // Update project
//     async update(req, res) {
//         try {
//             const { name, description, client_id, status, start_date, end_date, budget } = req.body;
//             await pool.query(
//                 'UPDATE projects SET name = ?, description = ?, client_id = ?, status = ?, start_date = ?, end_date = ?, budget = ? WHERE id = ?',
//                 [name, description, client_id, status, start_date, end_date, budget, req.params.id]
//             );
//             res.json({ id: req.params.id, ...req.body });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },

//     // Delete project
//     async delete(req, res) {
//         try {
//             await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
//             res.json({ message: 'Project deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     }
// };

const projectController = {
    async getProjects(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_projects 
                WHERE client_id = ? 
                ORDER BY created_at DESC`,
                [req.params.clientId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Error fetching projects' });
        }
    },

    async createProject(req, res) {
        try {
            const { name, description, status, start_date, end_date, budget } = req.body;
            const [result] = await pool.query(
                `INSERT INTO client_projects 
                (client_id, name, description, status, start_date, end_date, budget) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [req.params.clientId, name, description, status, start_date, end_date, budget]
            );
            res.status(201).json({
                id: result.insertId,
                ...req.body
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Error creating project' });
        }
    },

    async updateProject(req, res) {
        try {
            const { name, description, status, start_date, end_date, budget } = req.body;
            await pool.query(
                `UPDATE client_projects 
                SET name = ?, description = ?, status = ?, start_date = ?, end_date = ?, budget = ? 
                WHERE id = ? AND client_id = ?`,
                [name, description, status, start_date, end_date, budget, req.params.id, req.params.clientId]
            );
            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Error updating project' });
        }
    },

    async deleteProject(req, res) {
        try {
            await pool.query(
                'DELETE FROM client_projects WHERE id = ? AND client_id = ?',
                [req.params.id, req.params.clientId]
            );
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Error deleting project' });
        }
    }
};

module.exports = projectController;