const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/parking:
 *   post:
 *     summary: Create a new parking location (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - totalSpaces
 *               - location
 *               - feePerHour
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               totalSpaces:
 *                 type: integer
 *               location:
 *                 type: string
 *               feePerHour:
 *                 type: number
 */
router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { code, name, totalSpaces, location, feePerHour } = req.body;

    const parking = await prisma.parking.create({
      data: {
        code,
        name,
        totalSpaces,
        availableSpaces: totalSpaces,
        location,
        feePerHour
      }
    });

    res.status(201).json(parking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating parking location' });
  }
});

/**
 * @swagger
 * /api/parking:
 *   get:
 *     summary: Get all parking locations
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const parkings = await prisma.parking.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        totalSpaces: true,
        availableSpaces: true,
        location: true,
        feePerHour: true
      }
    });

    res.json(parkings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parking locations' });
  }
});

/**
 * @swagger
 * /api/parking/{code}:
 *   get:
 *     summary: Get parking location by code
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:code', authenticateToken, async (req, res) => {
  try {
    const { code } = req.params;

    const parking = await prisma.parking.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        totalSpaces: true,
        availableSpaces: true,
        location: true,
        feePerHour: true
      }
    });

    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    res.json(parking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parking location' });
  }
});

/**
 * @swagger
 * /api/parking/{code}:
 *   put:
 *     summary: Update parking location (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               totalSpaces:
 *                 type: integer
 *               location:
 *                 type: string
 *               feePerHour:
 *                 type: number
 */
router.put('/:code', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { code } = req.params;
    const { name, totalSpaces, location, feePerHour } = req.body;

    const parking = await prisma.parking.findUnique({ where: { code } });
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    const updatedParking = await prisma.parking.update({
      where: { code },
      data: {
        name,
        totalSpaces,
        availableSpaces: totalSpaces - (parking.totalSpaces - parking.availableSpaces),
        location,
        feePerHour
      }
    });

    res.json(updatedParking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating parking location' });
  }
});

/**
 * @swagger
 * /api/parking/{code}:
 *   delete:
 *     summary: Delete parking location (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:code', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { code } = req.params;

    const parking = await prisma.parking.findUnique({ where: { code } });
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    await prisma.parking.delete({ where: { code } });

    res.json({ message: 'Parking location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting parking location' });
  }
});

module.exports = router; 