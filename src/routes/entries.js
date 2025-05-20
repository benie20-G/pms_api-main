const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { sendEntryTicket, sendExitBill } = require('../utils/email');

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/entries:
 *   post:
 *     summary: Record car entry
 *     tags: [Entries]
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

    if (parking.availableSpaces <= 0) {
      return res.status(400).json({ message: 'No available spaces in this parking location' });
    }

    const entry = await prisma.parkingEntry.create({
      data: {
        plateNumber,
        parkingId: parking.id,
        userId
      }
    });

    await prisma.parking.update({
      where: { id: parking.id },
      data: { availableSpaces: parking.availableSpaces - 1 }
    });

    // Send entry ticket via email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await sendEntryTicket(user.email, {
      entryId: entry.id,
      plateNumber,
      parkingName: parking.name,
      entryDateTime: entry.entryDateTime,
      feePerHour: parking.feePerHour
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error recording car entry' });
  }
});

/**
 * @swagger
 * /api/entries/{id}/exit:
 *   put:
 *     summary: Record car exit
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id/exit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await prisma.parkingEntry.findUnique({
      where: { id },
      include: { parking: true }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry record not found' });
    }

    if (entry.exitDateTime) {
      return res.status(400).json({ message: 'Car has already exited' });
    }

    const exitDateTime = new Date();
    const durationInHours = (exitDateTime - entry.entryDateTime) / (1000 * 60 * 60);
    const chargedAmount = durationInHours * entry.parking.feePerHour;

    const updatedEntry = await prisma.parkingEntry.update({
      where: { id },
      data: {
        exitDateTime,
        chargedAmount
      }
    });

    await prisma.parking.update({
      where: { id: entry.parkingId },
      data: { availableSpaces: { increment: 1 } }
    });

    // Send exit bill via email
    const user = await prisma.user.findUnique({ where: { id: entry.userId } });
    await sendExitBill(user.email, {
      entryId: entry.id,
      plateNumber: entry.plateNumber,
      parkingName: entry.parking.name,
      entryDateTime: entry.entryDateTime,
      exitDateTime,
      durationInHours,
      chargedAmount
    });

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error recording car exit' });
  }
});

/**
 * @swagger
 * /api/entries:
 *   get:
 *     summary: Get all parking entries with pagination and filtering
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: plateNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: parkingCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      plateNumber,
      parkingCode,
      startDate,
      endDate
    } = req.query;

    const where = {};
    if (plateNumber) where.plateNumber = { contains: plateNumber };
    if (parkingCode) {
      const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
      if (parking) where.parkingId = parking.id;
    }
    if (startDate || endDate) {
      where.entryDateTime = {};
      if (startDate) where.entryDateTime.gte = new Date(startDate);
      if (endDate) where.entryDateTime.lte = new Date(endDate);
    }

    const entries = await prisma.parkingEntry.findMany({
      where,
      include: {
        parking: {
          select: {
            code: true,
            name: true,
            location: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { entryDateTime: 'desc' }
    });

    const total = await prisma.parkingEntry.count({ where });

    res.json({
      entries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parking entries' });
  }
});

module.exports = router; 