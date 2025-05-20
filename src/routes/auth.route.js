const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router; 