const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      req.user = await User.findById(decoded.userId).populate('role').select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const authorize = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(403);
      return next(new Error('Not authorized as no role assigned'));
    }

    // Super Admin has all access
    if (req.user.role.name === 'Super Admin') {
      return next();
    }

    // Check if the user's role has at least one of the allowed permissions
    const userPermissions = req.user.role.permissions || [];
    const hasPermission = allowedPermissions.some(permission => userPermissions.includes(permission));

    if (hasPermission) {
      return next();
    } else {
      res.status(403);
      return next(new Error('Forbidden: You do not have the required permissions'));
    }
  };
};

module.exports = { protect, authorize };
