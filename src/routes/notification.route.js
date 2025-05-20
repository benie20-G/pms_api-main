const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require('../controllers/notification.controller');

router.get('/', authenticateToken, getNotifications);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);

module.exports = router; 