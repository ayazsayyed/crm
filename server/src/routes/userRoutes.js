// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get all users
router.get('/', auth, userController.getUsers);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Get current user's profile
router.get('/profile/me', auth, userController.getCurrentUser);

// Update user profile
router.put('/profile/me', auth, userController.updateProfile);

// Change password
router.put('/profile/password', auth, userController.changePassword);

// Admin routes (add role check middleware)
router.post('/', auth, userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;