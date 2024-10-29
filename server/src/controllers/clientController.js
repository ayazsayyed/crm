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
    },
    // Get single client with details
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
            res.status(500).json({ message: 'Error fetching client details' });
        }
    },

    // Get client contacts
    async getClientContacts(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_contacts 
                WHERE client_id = ? 
                ORDER BY contact_date DESC`,
                [req.params.id]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ message: 'Error fetching contacts' });
        }
    },

    // Get client projects
    async getClientProjects(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_projects 
                WHERE client_id = ? 
                ORDER BY created_at DESC`,
                [req.params.id]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Error fetching projects' });
        }
    },

    // Get client documents
    async getClientDocuments(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_documents 
                WHERE client_id = ? 
                ORDER BY uploaded_at DESC`,
                [req.params.id]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({ message: 'Error fetching documents' });
        }
    },

    // Get client notes
    async getClientNotes(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_notes 
                WHERE client_id = ? 
                ORDER BY created_at DESC`,
                [req.params.id]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({ message: 'Error fetching notes' });
        }
    }
};

module.exports = clientController;