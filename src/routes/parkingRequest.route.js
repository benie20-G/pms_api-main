const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    createRequest,
    approveRequest,
    rejectRequest,
    requestExit,
    approveExit,
    processPayment
} = require('../controllers/parkingRequest.controller');

router.post('/', authenticateToken, createRequest);

router.put('/:id/approve', authenticateToken, authorizeRole('ADMIN'), approveRequest);

router.put('/:id/reject', authenticateToken, authorizeRole('ADMIN'), rejectRequest);

router.put('/:id/exit-request', authenticateToken, requestExit);

router.put('/:id/exit-approve', authenticateToken, authorizeRole('ADMIN'), approveExit);

router.put('/:id/payment', authenticateToken, processPayment);

module.exports = router; 