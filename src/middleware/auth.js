const jwt = require('jsonwebtoken');
const ServerResponse = require('../utils/ServerResponse');

const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = "9cd945ca506a9a4ce8c20091dda963a046df76be0c801f7f1d77dc317903f345"

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return ServerResponse.unauthorized(res, 'Access token required');
    }

   

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err.message);
        if (err.name === 'TokenExpiredError') {
          return ServerResponse.unauthorized(res, 'Token has expired');
        }
        return ServerResponse.unauthorized(res, 'Invalid token');
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in authenticateToken:', error);
    return ServerResponse.serverError(res);
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return ServerResponse.unauthorized(res, 'User not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        return ServerResponse.forbidden(res, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      console.error('Error in authorizeRole:', error);
      return ServerResponse.serverError(res);
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
}; 