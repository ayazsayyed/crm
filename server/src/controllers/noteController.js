// server/src/controllers/noteController.js
const pool = require('../config/database');
const noteController = {
    async getNotes(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_notes 
                WHERE client_id = ? 
                ORDER BY created_at DESC`,
                [req.params.clientId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({ message: 'Error fetching notes' });
        }
    },

    async createNote(req, res) {
        try {
            const { note } = req.body;
            const [result] = await pool.query(
                `INSERT INTO client_notes 
                (client_id, note, created_by) 
                VALUES (?, ?, ?)`,
                [req.params.clientId, note, req.user.userId]
            );
            res.status(201).json({
                id: result.insertId,
                note,
                created_by: req.user.userId,
                created_at: new Date()
            });
        } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).json({ message: 'Error creating note' });
        }
    },

    async updateNote(req, res) {
        try {
            const { note } = req.body;
            await pool.query(
                `UPDATE client_notes 
                SET note = ? 
                WHERE id = ? AND client_id = ?`,
                [note, req.params.id, req.params.clientId]
            );
            res.json({ id: req.params.id, note });
        } catch (error) {
            console.error('Error updating note:', error);
            res.status(500).json({ message: 'Error updating note' });
        }
    },

    async deleteNote(req, res) {
        try {
            await pool.query(
                'DELETE FROM client_notes WHERE id = ? AND client_id = ?',
                [req.params.id, req.params.clientId]
            );
            res.json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({ message: 'Error deleting note' });
        }
    }
};

module.exports = noteController;