const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    registerVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicle.controller');

router.post('/', authenticateToken, registerVehicle);
router.get('/', authenticateToken, getVehicles);
router.put('/:vehicleId', authenticateToken, updateVehicle);
router.delete('/:vehicleId', authenticateToken, deleteVehicle);

module.exports = router; 