const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  validateRequest
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

const validateParkingRequest = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('parkingSlotId').notEmpty().withMessage('Parking slot ID is required'),
  validateRequest
];

const validateVehicle = [
  body('plateNumber').notEmpty().withMessage('Plate number is required'),
  body('color').notEmpty().withMessage('Color is required'),
  validateRequest
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateParkingRequest,
  validateVehicle,
  validateRequest
}; 