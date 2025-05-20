const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { sendEntryTicket, sendExitBill, sendPaymentConfirmation } = require('../utils/email');

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Request a parking space
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - parkingCode
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { plateNumber, parkingCode } = req.body;
    const userId = req.user.userId;

    const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    const request = await prisma.parkingRequest.create({
      data: {
        userId,
        vehicleId: plateNumber, // Using plateNumber as vehicleId for simplicity
        status: 'PENDING',
        requestedAt: new Date()
      }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating parking request' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/approve:
 *   put:
 *     summary: Approve parking request (Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id/approve', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        user: true,
        parking: true
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        checkIn: new Date()
      }
    });

    // Send entry ticket
    await sendEntryTicket(request.user.email, {
      entryId: request.id,
      plateNumber: request.vehicleId,
      parkingName: request.parking.name,
      entryDateTime: updatedRequest.checkIn,
      feePerHour: request.parking.feePerHour
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error approving request' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/reject:
 *   put:
 *     summary: Reject parking request (Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id/reject', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.parkingRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date()
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/exit:
 *   post:
 *     summary: Request exit approval
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/:id/exit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.parkingRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Request is not approved' });
    }

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'EXIT_REQUESTED',
        exitRequestedAt: new Date()
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error requesting exit' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/exit-approve:
 *   put:
 *     summary: Approve exit request (Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id/exit-approve', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        user: true,
        parking: true
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'EXIT_REQUESTED') {
      return res.status(400).json({ message: 'Exit is not requested' });
    }

    const exitDateTime = new Date();
    const durationInHours = (exitDateTime - request.checkIn) / (1000 * 60 * 60);
    const chargedAmount = durationInHours * request.parking.feePerHour;

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'EXIT_APPROVED',
        exitApprovedAt: exitDateTime,
        checkOut: exitDateTime,
        amountToPay: chargedAmount
      }
    });

    // Send exit bill
    await sendExitBill(request.user.email, {
      entryId: request.id,
      plateNumber: request.vehicleId,
      parkingName: request.parking.name,
      entryDateTime: request.checkIn,
      exitDateTime,
      durationInHours,
      chargedAmount
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error approving exit' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/pay:
 *   post:
 *     summary: Process payment for parking
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/:id/pay', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        user: true,
        parking: true
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'EXIT_APPROVED') {
      return res.status(400).json({ message: 'Exit is not approved' });
    }

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    });

    // Send payment confirmation
    await sendPaymentConfirmation(request.user.email, {
      entryId: request.id,
      plateNumber: request.vehicleId,
      parkingName: request.parking.name,
      amount: request.amountToPay,
      paidAt: updatedRequest.paidAt
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
});

module.exports = router; 