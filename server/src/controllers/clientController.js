// server/src/controllers/clientController.js
const pool = require('../config/database');

const clientController = {
    // Get all clients
    async getClients(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    c.*,
                    u.username as created_by_name
                FROM clients c
                LEFT JOIN users u ON c.created_by = u.id
                ORDER BY c.created_at DESC`
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json({ message: 'Error fetching clients' });
        }
    },

    // Get single client
    async getClient(req, res) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM clients WHERE id = ?',
                [req.params.id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Client not found' });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching client:', error);
            res.status(500).json({ message: 'Error fetching client' });
        }
    },

    // Create client
    async createClient(req, res) {
        try {
            const { 
                company_name, 
                contact_person, 
                email, 
                phone, 
                address, 
                status 
            } = req.body;

            const [result] = await pool.query(
                `INSERT INTO clients 
                (company_name, contact_person, email, phone, address, status, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [company_name, contact_person, email, phone, address, status, req.user.id]
            );

            res.status(201).json({
                id: result.insertId,
                ...req.body,
                created_by: req.user.id
            });
        } catch (error) {
            console.error('Error creating client:', error);
            res.status(500).json({ message: 'Error creating client' });
        }
    },

    // Update client
    async updateClient(req, res) {
        try {
            const { 
                company_name, 
                contact_person, 
                email, 
                phone, 
                address, 
                status 
            } = req.body;

            const [result] = await pool.query(
                `UPDATE clients 
                SET company_name = ?, contact_person = ?, email = ?, 
                    phone = ?, address = ?, status = ? 
                WHERE id = ?`,
                [company_name, contact_person, email, phone, address, status, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Client not found' });
            }

            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            console.error('Error updating client:', error);
            res.status(500).json({ message: 'Error updating client' });
        }
    },

    // Delete client
    async deleteClient(req, res) {
        try {
            const [result] = await pool.query(
                'DELETE FROM clients WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Client not found' });
            }

            res.json({ message: 'Client deleted successfully' });
        } catch (error) {
            console.error('Error deleting client:', error);
            res.status(500).json({ message: 'Error deleting client' });
        }
    }
};

module.exports = clientController;