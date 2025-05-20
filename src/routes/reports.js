const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/reports/entries:
 *   get:
 *     summary: Get parking entries report between dates
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: parkingCode
 *         schema:
 *           type: string
 */
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, parkingCode } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const where = {
      entryDateTime: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (parkingCode) {
      const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
      if (parking) where.parkingId = parking.id;
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
      orderBy: { entryDateTime: 'desc' }
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error generating entries report' });
  }
});

/**
 * @swagger
 * /api/reports/exits:
 *   get:
 *     summary: Get parking exits report between dates
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: parkingCode
 *         schema:
 *           type: string
 */
router.get('/exits', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, parkingCode } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const where = {
      exitDateTime: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (parkingCode) {
      const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
      if (parking) where.parkingId = parking.id;
    }

    const exits = await prisma.parkingEntry.findMany({
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
      orderBy: { exitDateTime: 'desc' }
    });

    const totalRevenue = exits.reduce((sum, exit) => sum + exit.chargedAmount, 0);

    res.json({
      exits,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating exits report' });
  }
});

/**
 * @swagger
 * /api/reports/statistics:
 *   get:
 *     summary: Get parking statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: parkingCode
 *         schema:
 *           type: string
 */
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const { parkingCode } = req.query;

    const where = {};
    if (parkingCode) {
      const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
      if (parking) where.parkingId = parking.id;
    }

    const [
      totalEntries,
      activeEntries,
      totalRevenue,
      parkingStats
    ] = await Promise.all([
      prisma.parkingEntry.count({ where }),
      prisma.parkingEntry.count({
        where: {
          ...where,
          exitDateTime: null
        }
      }),
      prisma.parkingEntry.aggregate({
        where: {
          ...where,
          exitDateTime: { not: null }
        },
        _sum: {
          chargedAmount: true
        }
      }),
      prisma.parking.findMany({
        select: {
          code: true,
          name: true,
          totalSpaces: true,
          availableSpaces: true,
          _count: {
            select: {
              parkingEntries: {
                where: {
                  exitDateTime: null
                }
              }
            }
          }
        }
      })
    ]);

    res.json({
      totalEntries,
      activeEntries,
      totalRevenue: totalRevenue._sum.chargedAmount || 0,
      parkingStats: parkingStats.map(parking => ({
        code: parking.code,
        name: parking.name,
        totalSpaces: parking.totalSpaces,
        availableSpaces: parking.availableSpaces,
        occupiedSpaces: parking._count.parkingEntries
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating statistics' });
  }
});

module.exports = router; 