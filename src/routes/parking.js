const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const prisma = new PrismaClient();

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