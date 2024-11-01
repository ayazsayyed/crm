// server/src/controllers/taskController.js
const pool = require('../config/database');

const taskController = {
    async getProjectTasks(req, res) {
        try {
            const [tasks] = await pool.query(`
                SELECT 
                    t.*,
                    u.username as assigned_to_name,
                    creator.username as created_by_name,
                    COUNT(tc.id) as comment_count
                FROM project_tasks t
                LEFT JOIN users u ON t.assigned_to = u.id
                LEFT JOIN users creator ON t.created_by = creator.id
                LEFT JOIN task_comments tc ON t.id = tc.task_id
                WHERE t.project_id = ?
                GROUP BY t.id
                ORDER BY t.created_at DESC
            `, [req.params.projectId]);
            
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ message: 'Error fetching tasks' });
        }
    },

    async getTaskById(req, res) {
        try {
            const [tasks] = await pool.query(`
                SELECT 
                    t.*,
                    u.username as assigned_to_name,
                    creator.username as created_by_name
                FROM project_tasks t
                LEFT JOIN users u ON t.assigned_to = u.id
                LEFT JOIN users creator ON t.created_by = creator.id
                WHERE t.id = ? AND t.project_id = ?
            `, [req.params.taskId, req.params.projectId]);

            if (tasks.length === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(tasks[0]);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).json({ message: 'Error fetching task details' });
        }
    },

    async createTask(req, res) {
        try {
            const {
                title,
                description,
                status,
                priority,
                assigned_to,
                due_date,
                estimated_hours
            } = req.body;

            const [result] = await pool.query(
                `INSERT INTO project_tasks 
                (project_id, title, description, status, priority, assigned_to, due_date, estimated_hours, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [req.params.projectId, title, description, status, priority, assigned_to, due_date, estimated_hours, req.user.userId]
            );

            res.status(201).json({
                id: result.insertId,
                ...req.body
            });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Error creating task' });
        }
    },

    async updateTask(req, res) {
        try {
            const {
                title,
                description,
                status,
                priority,
                assigned_to,
                due_date,
                estimated_hours
            } = req.body;

            await pool.query(
                `UPDATE project_tasks 
                SET title = ?, description = ?, status = ?, priority = ?, 
                    assigned_to = ?, due_date = ?, estimated_hours = ?
                WHERE id = ? AND project_id = ?`,
                [title, description, status, priority, assigned_to, due_date, 
                 estimated_hours, req.params.taskId, req.params.projectId]
            );

            res.json({ id: req.params.taskId, ...req.body });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Error updating task' });
        }
    },

    async deleteTask(req, res) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Delete task comments first
            await connection.query(
                'DELETE FROM task_comments WHERE task_id = ?',
                [req.params.taskId]
            );

            // Delete the task
            await connection.query(
                'DELETE FROM project_tasks WHERE id = ? AND project_id = ?',
                [req.params.taskId, req.params.projectId]
            );

            await connection.commit();
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            await connection.rollback();
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Error deleting task' });
        } finally {
            connection.release();
        }
    },

    async getTaskComments(req, res) {
        try {
            const [comments] = await pool.query(`
                SELECT 
                    tc.*,
                    u.username as created_by_name
                FROM task_comments tc
                LEFT JOIN users u ON tc.created_by = u.id
                WHERE tc.task_id = ?
                ORDER BY tc.created_at DESC
            `, [req.params.taskId]);
            
            res.json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ message: 'Error fetching comments' });
        }
    },

    async addTaskComment(req, res) {
        try {
            const { comment } = req.body;
            const [result] = await pool.query(
                `INSERT INTO task_comments (task_id, comment, created_by) 
                VALUES (?, ?, ?)`,
                [req.params.taskId, comment, req.user.userId]
            );

            res.status(201).json({
                id: result.insertId,
                comment,
                created_by: req.user.userId,
                created_at: new Date()
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Error adding comment' });
        }
    },

    async deleteTaskComment(req, res) {
        try {
            await pool.query(
                'DELETE FROM task_comments WHERE id = ? AND task_id = ?',
                [req.params.commentId, req.params.taskId]
            );
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ message: 'Error deleting comment' });
        }
    }
};

module.exports = taskController;