const crypto = require('crypto');
const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePlateNumber = (plateNumber) => {
  // Add your plate number validation logic here
  // This is a simple example, you might want to adjust based on your requirements
  return /^[A-Z0-9-]{2,10}$/.test(plateNumber);
};

module.exports = {
  generateOTP,
  sanitizeInput,
  validateEmail,
  validatePlateNumber
}; 