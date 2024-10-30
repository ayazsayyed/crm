// server/src/controllers/contactController.js
const pool = require('../config/database');

const contactController = {
    async getContacts(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_contacts 
                WHERE client_id = ? 
                ORDER BY contact_date DESC`,
                [req.params.clientId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ message: 'Error fetching contacts' });
        }
    },

    async createContact(req, res) {
        try {
            const { contact_type, subject, description, contact_date } = req.body;
            const [result] = await pool.query(
                `INSERT INTO client_contacts 
                (client_id, contact_type, subject, description, contact_date, created_by) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [req.params.clientId, contact_type, subject, description, contact_date, req.user.userId]
            );
            res.status(201).json({
                id: result.insertId,
                ...req.body
            });
        } catch (error) {
            console.error('Error creating contact:', error);
            res.status(500).json({ message: 'Error creating contact' });
        }
    },

    async updateContact(req, res) {
        try {
            const { contact_type, subject, description, contact_date } = req.body;
            await pool.query(
                `UPDATE client_contacts 
                SET contact_type = ?, subject = ?, description = ?, contact_date = ? 
                WHERE id = ? AND client_id = ?`,
                [contact_type, subject, description, contact_date, req.params.id, req.params.clientId]
            );
            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            console.error('Error updating contact:', error);
            res.status(500).json({ message: 'Error updating contact' });
        }
    },

    async deleteContact(req, res) {
        try {
            await pool.query(
                'DELETE FROM client_contacts WHERE id = ? AND client_id = ?',
                [req.params.id, req.params.clientId]
            );
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Error deleting contact:', error);
            res.status(500).json({ message: 'Error deleting contact' });
        }
    }
};

module.exports = contactController;





