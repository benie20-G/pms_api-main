const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const parkingRoutes = require('./parking');
const entriesRoutes = require('./entries');
const reportsRoutes = require('./reports');
const requestsRoutes = require('./requests');

// Apply routes
router.use('/auth', authRoutes);
router.use('/parking', parkingRoutes);
router.use('/entries', entriesRoutes);
router.use('/reports', reportsRoutes);
router.use('/requests', requestsRoutes);

module.exports = router; 