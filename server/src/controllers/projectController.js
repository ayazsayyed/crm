// // server/src/controllers/projectController.js
// const pool = require('../config/database');

// const projectController = {
//     async getProjects(req, res) {
//         try {
//             const [rows] = await pool.query(
//                 `SELECT * FROM client_projects 
//                 WHERE client_id = ? 
//                 ORDER BY created_at DESC`,
//                 [req.params.clientId]
//             );
//             res.json(rows);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//             res.status(500).json({ message: 'Error fetching projects' });
//         }
//     },

//     async createProject(req, res) {
//         try {
//             const { name, description, status, start_date, end_date, budget } = req.body;
//             const [result] = await pool.query(
//                 `INSERT INTO client_projects 
//                 (client_id, name, description, status, start_date, end_date, budget) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
//                 [req.params.clientId, name, description, status, start_date, end_date, budget]
//             );
//             res.status(201).json({
//                 id: result.insertId,
//                 ...req.body
//             });
//         } catch (error) {
//             console.error('Error creating project:', error);
//             res.status(500).json({ message: 'Error creating project' });
//         }
//     },

//     async updateProject(req, res) {
//         try {
//             const { name, description, status, start_date, end_date, budget } = req.body;
//             await pool.query(
//                 `UPDATE client_projects 
//                 SET name = ?, description = ?, status = ?, start_date = ?, end_date = ?, budget = ? 
//                 WHERE id = ? AND client_id = ?`,
//                 [name, description, status, start_date, end_date, budget, req.params.id, req.params.clientId]
//             );
//             res.json({ id: req.params.id, ...req.body });
//         } catch (error) {
//             console.error('Error updating project:', error);
//             res.status(500).json({ message: 'Error updating project' });
//         }
//     },

//     async deleteProject(req, res) {
//         try {
//             await pool.query(
//                 'DELETE FROM client_projects WHERE id = ? AND client_id = ?',
//                 [req.params.id, req.params.clientId]
//             );
//             res.json({ message: 'Project deleted successfully' });
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             res.status(500).json({ message: 'Error deleting project' });
//         }
//     }
// };

// module.exports = projectController;



// server/src/controllers/projectController.js
const pool = require('../config/database');

const projectController = {
    async getProjects(req, res) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.*,
                    c.company_name as client_name,
                    COUNT(DISTINCT t.id) as total_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks
                FROM client_projects p
                LEFT JOIN clients c ON p.client_id = c.id
                LEFT JOIN project_tasks t ON p.id = t.project_id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            `);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Error fetching projects' });
        }
    },

    async getProjectById(req, res) {
        try {
            const [projects] = await pool.query(`
                SELECT 
                    p.*,
                    c.company_name as client_name
                FROM client_projects p
                LEFT JOIN clients c ON p.client_id = c.id
                WHERE p.id = ?
            `, [req.params.id]);

            if (projects.length === 0) {
                return res.status(404).json({ message: 'Project not found' });
            }
            const [teamMembers] = await pool.query(`
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    u.role,
                    pt.role as project_role
                FROM project_team pt
                JOIN users u ON pt.user_id = u.id
                WHERE pt.project_id = ?
            `, [req.params.id]);

            const project = {
                ...projects[0],
                team_members: teamMembers
            };

            res.json(project);
        } catch (error) {
            console.error('Error fetching project:', error);
            res.status(500).json({ message: 'Error fetching project details' });
        }
    },

    async createProject(req, res) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const {
                name,
                description,
                client_id,
                status,
                priority,
                start_date,
                end_date,
                budget,
                estimated_hours,
                assigned_team
            } = req.body;
console.log('req.user ', req.user.userId);

            // Insert project
            const [result] = await connection.query(
                `INSERT INTO client_projects 
                (name, description, client_id, status, priority, start_date, end_date, budget, estimated_hours, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, client_id, status, priority, start_date, end_date, budget, estimated_hours, req.user.userId]
            );

            const projectId = result.insertId;

            // Insert team members if provided
            if (assigned_team && assigned_team.length > 0) {
                const teamValues = assigned_team.map(userId => [projectId, userId]);
                console.log('teamValues ', teamValues);
                
                await connection.query(
                    'INSERT INTO project_team (project_id, user_id) VALUES ?',
                    [teamValues]
                );
            }

            await connection.commit();
            res.status(201).json({
                id: projectId,
                ...req.body
            });
        } catch (error) {
            await connection.rollback();
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Error creating project' });
        } finally {
            connection.release();
        }
    },

    async updateProject(req, res) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const {
                name,
                description,
                client_id,
                status,
                priority,
                start_date,
                end_date,
                budget,
                estimated_hours,
                progress,
                assigned_team
            } = req.body;

            // Update project
            await connection.query(
                `UPDATE client_projects 
                SET name = ?, description = ?, client_id = ?, status = ?, 
                    priority = ?, start_date = ?, end_date = ?, budget = ?, 
                    estimated_hours = ?, progress = ?
                WHERE id = ?`,
                [name, description, client_id, status, priority, start_date, 
                 end_date, budget, estimated_hours, progress, req.params.id]
            );

            // Update team members
            if (assigned_team) {
                // Remove existing team members
                await connection.query(
                    'DELETE FROM project_team WHERE project_id = ?',
                    [req.params.id]
                );

                // Add new team members
                if (assigned_team.length > 0) {
                    const teamValues = assigned_team.map(userId => [req.params.id, userId]);
                    await connection.query(
                        'INSERT INTO project_team (project_id, user_id) VALUES ?',
                        [teamValues]
                    );
                }
            }

            await connection.commit();
            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            await connection.rollback();
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Error updating project' });
        } finally {
            connection.release();
        }
    },

    async deleteProject(req, res) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Delete related records first
            await connection.query('DELETE FROM task_comments WHERE task_id IN (SELECT id FROM project_tasks WHERE project_id = ?)', [req.params.id]);
            await connection.query('DELETE FROM project_tasks WHERE project_id = ?', [req.params.id]);
            await connection.query('DELETE FROM project_team WHERE project_id = ?', [req.params.id]);
            
            // Delete the project
            await connection.query('DELETE FROM client_projects WHERE id = ?', [req.params.id]);

            await connection.commit();
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            await connection.rollback();
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Error deleting project' });
        } finally {
            connection.release();
        }
    },

    async getProjectStatistics(req, res) {
        try {
            const [statistics] = await pool.query(`
                SELECT 
                    COUNT(DISTINCT t.id) as total_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as in_progress_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) as pending_tasks,
                    SUM(CASE WHEN t.status = 'completed' THEN t.estimated_hours ELSE 0 END) as completed_hours,
                    p.estimated_hours as total_estimated_hours
                FROM client_projects p
                LEFT JOIN project_tasks t ON p.id = t.project_id
                WHERE p.id = ?
                GROUP BY p.id
            `, [req.params.id]);

            res.json(statistics[0]);
        } catch (error) {
            console.error('Error fetching project statistics:', error);
            res.status(500).json({ message: 'Error fetching project statistics' });
        }
    }
};

module.exports = projectController;