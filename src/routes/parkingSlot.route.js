const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getAvailableSlots,
    updateSlotStatus,
    getSlotHistory
} = require('../controllers/parkingSlot.controller');

router.get('/:parkingCode/available', authenticateToken, getAvailableSlots);
router.put('/:slotId/status', authenticateToken, authorizeRole('ADMIN'), updateSlotStatus);
router.get('/:slotId/history', authenticateToken, authorizeRole('ADMIN'), getSlotHistory);

module.exports = router; 