// server/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

router.get('/', auth, clientController.getClients);
router.get('/:id', auth, clientController.getClient);
router.post('/', auth, clientController.createClient);
router.put('/:id', auth, clientController.updateClient);
router.delete('/:id', auth, clientController.deleteClient);


// New routes for client details
router.get('/:id', auth, clientController.getClient);
router.get('/:id/contacts', auth, clientController.getClientContacts);
router.get('/:id/projects', auth, clientController.getClientProjects);
router.get('/:id/documents', auth, clientController.getClientDocuments);
router.get('/:id/notes', auth, clientController.getClientNotes);

// New routes for adding related data
// router.post('/:id/contacts', auth, clientController.addClientContact);
// router.post('/:id/documents', auth, clientController.addClientDocument);
// router.post('/:id/notes', auth, clientController.addClientNote);

module.exports = router;

