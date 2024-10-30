// server/src/controllers/documentController.js
const pool = require('../config/database');
const documentController = {
    async getDocuments(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM client_documents 
                WHERE client_id = ? 
                ORDER BY uploaded_at DESC`,
                [req.params.clientId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({ message: 'Error fetching documents' });
        }
    },

    async uploadDocument(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { comments } = req.body;
            const [result] = await pool.query(
                `INSERT INTO client_documents 
                (client_id, file_name, file_path, file_type, file_size, comments, uploaded_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.params.clientId,
                    req.file.originalname,
                    req.file.path,
                    req.file.mimetype,
                    req.file.size,
                    comments,
                    req.user.userId
                ]
            );

            res.status(201).json({
                id: result.insertId,
                file_name: req.file.originalname,
                file_path: req.file.path
            });
        } catch (error) {
            console.error('Error uploading document:', error);
            res.status(500).json({ message: 'Error uploading document' });
        }
    },

    async downloadDocument(req, res) {
        try {
            const [documents] = await pool.query(
                'SELECT * FROM client_documents WHERE id = ? AND client_id = ?',
                [req.params.id, req.params.clientId]
            );

            if (documents.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }

            const document = documents[0];
            res.download(documents);
        } catch (error) {
            console.error('Error downloading document:', error);
            res.status(500).json({ message: 'Error downloading document' });
        }
    },

    async deleteDocument(req, res) {
        try {
            // You might want to delete the actual file here as well
            await pool.query(
                'DELETE FROM client_documents WHERE id = ? AND client_id = ?',
                [req.params.id, req.params.clientId]
            );
            res.json({ message: 'Document deleted successfully' });
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({ message: 'Error deleting document' });
        }
    }
};

module.exports = documentController;