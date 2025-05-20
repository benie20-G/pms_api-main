const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/user.controller');

// User profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Admin only routes
router.get('/', authenticateToken, authorizeRole('ADMIN'), getAllUsers);
router.put('/:userId/role', authenticateToken, authorizeRole('ADMIN'), updateUserRole);
router.delete('/:userId', authenticateToken, authorizeRole('ADMIN'), deleteUser);

module.exports = router; 