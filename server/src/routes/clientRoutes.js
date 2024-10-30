// server/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const contactController = require('../controllers/contactController');
const projectController = require('../controllers/projectController');
const documentController = require('../controllers/documentController');
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, clientController.getClients);
router.get('/:id', auth, clientController.getClient);
router.post('/', auth, clientController.createClient);
router.put('/:id', auth, clientController.updateClient);
router.delete('/:id', auth, clientController.deleteClient);


// New routes for client details
// router.get('/:id', auth, clientController.getClient);
// router.get('/:id/contacts', auth, clientController.getClientContacts);
// router.get('/:id/projects', auth, clientController.getClientProjects);
// router.get('/:id/documents', auth, clientController.getClientDocuments);
// router.get('/:id/notes', auth, clientController.getClientNotes);

// New routes for adding related data
// router.post('/:id/contacts', auth, clientController.addClientContact);
// router.post('/:id/documents', auth, clientController.addClientDocument);
// router.post('/:id/notes', auth, clientController.addClientNote);

// Contact routes
router.get('/:clientId/contacts', auth, contactController.getContacts);
router.post('/:clientId/contacts', auth, contactController.createContact);
router.put('/:clientId/contacts/:id', auth, contactController.updateContact);
router.delete('/:clientId/contacts/:id', auth, contactController.deleteContact);

// Project routes
router.get('/:clientId/projects', auth, projectController.getProjects);
router.post('/:clientId/projects', auth, projectController.createProject);
router.put('/:clientId/projects/:id', auth, projectController.updateProject);
router.delete('/:clientId/projects/:id', auth, projectController.deleteProject);

// Document routes
router.get('/:clientId/documents', auth, documentController.getDocuments);
router.post('/:clientId/documents', auth, upload.single('file'), documentController.uploadDocument);
router.get('/:clientId/documents/:id/download', auth, documentController.downloadDocument);
router.delete('/:clientId/documents/:id', auth, documentController.deleteDocument);

// Note routes
router.get('/:clientId/notes', auth, noteController.getNotes);
router.post('/:clientId/notes', auth, noteController.createNote);
router.put('/:clientId/notes/:id', auth, noteController.updateNote);
router.delete('/:clientId/notes/:id', auth, noteController.deleteNote);

module.exports = router;

