// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Add console.log for debugging
router.post('/register', (req, res) => {
    console.log('Register route hit:', req.body);
    authController.register(req, res);
});

router.post('/login', (req, res) => {
    console.log('Login route hit:', req.body);
    authController.login(req, res);
});

router.get('/verify', auth, (req, res) => {
    console.log('verify route hit:', req.body);
    authController.verifyToken(req, res);
});
module.exports = router;