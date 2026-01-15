const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errorMessages
    });
  }
  
  next();
};

/**
 * Middleware to validate query parameters for filtering and sorting
 */
const validateQueryParams = (req, res, next) => {
  const { sortBy, sortOrder, page, limit, ...filters } = req.query;
  
  // Validate sortOrder
  if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid sortOrder. Must be "asc" or "desc"'
    });
  }
  
  // Validate pagination parameters
  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      error: 'Invalid page. Must be a positive integer'
    });
  }
  
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      error: 'Invalid limit. Must be a positive integer between 1 and 100'
    });
  }
  
  // Validate filter values (prevent SQL injection by checking for suspicious characters)
  const suspiciousPattern = /[\;\\\'\"\-\-]/;
  for (const [key, value] of Object.entries(filters)) {
    if (value && suspiciousPattern.test(value)) {
      return res.status(400).json({
        error: `Invalid characters in filter value for ${key}`
      });
    }
  }
  
  next();
};

/**
 * Middleware to validate rating range
 */
const validateRating = (req, res, next) => {
  const { rating } = req.body;
  
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      error: 'Rating must be between 1 and 5'
    });
  }
  
  next();
};

/**
 * Middleware to validate user role
 */
const validateRole = (req, res, next) => {
  const { role } = req.body;
  
  if (role && !['admin', 'user', 'store_owner'].includes(role)) {
    return res.status(400).json({
      error: 'Invalid role. Must be one of: admin, user, store_owner'
    });
  }
  
  next();
};

/**
 * Middleware to validate email uniqueness (for user creation)
 */
const validateUniqueEmail = (model) => {
  return async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log("email is: ", email);
      
      if (!email) {
        return next();
      }
      
      let existingRecord;
      if (model === 'user') {
        const User = require('../models/User');
        existingRecord = await User.findByEmail(email);
      } else if (model === 'store') {
        const Store = require('../models/Store');
        existingRecord = await Store.findByEmail(email);
      }
      
      if (existingRecord) {
        return res.status(400).json({
          error: `${model.charAt(0).toUpperCase() + model.slice(1)} with this email already exists`
        });
      }
      
      next();
    } catch (error) {
      console.error('Email validation error:', error);
      // Provide more specific error message for database connection issues
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(500).json({ 
          error: 'Database connection failed. Please check your database configuration.',
          details: error.message 
        });
      }
      res.status(500).json({ error: 'Internal server error during email validation', details: error.message });
    }
  };
};

/**
 * Middleware to validate store ownership
 */
const validateStoreOwnership = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.store_id;
    const userId = req.user.id;
    
    if (!storeId) {
      return next();
    }
    
    const Store = require('../models/Store');
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // For store owners, check if they own the store
    if (req.user.role === 'store_owner' && store.owner_id !== userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own store' 
      });
    }
    
    req.store = store; // Attach store to request for later use
    next();
  } catch (error) {
    console.error('Store ownership validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to validate user exists
 */
const validateUserExists = async (req, res, next) => {
  try {
    console.log("validate user : ");
    const userId = req.params.id || req.body.owner_id;

    console.log("userId is: ", userId);
    
    if (!userId) {
      return next();
    }
    
    const User = require('../models/User');
    const user = await User.findById(userId);
    console.log("user is: ",user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.targetUser = user; // Attach user to request for later use
    console.log("target user");
    next();
  } catch (error) {
    console.error('User existence validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to validate password strength
 */
const validatePasswordStrength = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return next();
  }
  
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be 8-16 characters long, contain at least one uppercase letter and one special character'
    });
  }
  
  next();
};

/**
 * Middleware to validate name length
 */
const validateNameLength = (req, res, next) => {
  const { name } = req.body;
  
  if (name && (name.length < 20 || name.length > 60)) {
    return res.status(400).json({
      error: 'Name must be between 20 and 60 characters'
    });
  }
  
  next();
};

/**
 * Middleware to validate address length
 */
const validateAddressLength = (req, res, next) => {
  const { address } = req.body;
  
  if (address && address.length > 400) {
    return res.status(400).json({
      error: 'Address must not exceed 400 characters'
    });
  }
  
  next();
};

/**
 * Middleware to sanitize input data
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize string fields by trimming and removing extra spaces
  const sanitizeString = (str) => {
    if (typeof str === 'string') {
      return str.trim().replace(/\s+/g, ' ');
    }
    return str;
  };
  
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }
  
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }
  
  next();
};

/**
 * Middleware to validate pagination parameters with defaults
 */
const validatePagination = (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;
  
  // Convert to integers
  page = parseInt(page);
  limit = parseInt(limit);
  
  // Validate and set defaults
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  // Add to request for use in controllers
  req.pagination = {
    page,
    limit,
    offset
  };
  
  next();
};

/**
 * Middleware to prevent self-deletion or role change for current user
 */
const validateSelfAction = (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;
  
  if (targetUserId && parseInt(targetUserId) === parseInt(currentUserId)) {
    return res.status(400).json({
      error: 'Cannot perform this action on your own account'
    });
  }
  
  next();
};

/**
 * Middleware to validate store update fields
 */
const validateStoreUpdate = (req, res, next) => {
  const { name, email, address } = req.body;
  
  // Validate store name if provided
  if (name !== undefined) {
    if (typeof name !== 'string') {
      return res.status(400).json({
        error: 'Store name must be a string'
      });
    }
    
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({
        error: 'Store name must be between 20 and 60 characters'
      });
    }
  }
  
  // Validate store email if provided
  if (email !== undefined) {
    if (typeof email !== 'string') {
      return res.status(400).json({
        error: 'Store email must be a string'
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
  }
  
  // Validate store address if provided
  if (address !== undefined) {
    if (typeof address !== 'string') {
      return res.status(400).json({
        error: 'Store address must be a string'
      });
    }
    
    if (address.length > 400) {
      return res.status(400).json({
        error: 'Store address must not exceed 400 characters'
      });
    }
  }
  
  // Check if at least one field is being updated
  if (name === undefined && email === undefined && address === undefined && req.body.owner_id === undefined) {
    return res.status(400).json({
      error: 'At least one field must be provided for update'
    });
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateQueryParams,
  validateRating,
  validateRole,
  validateUniqueEmail,
  validateStoreOwnership,
  validateUserExists,
  validatePasswordStrength,
  validateNameLength,
  validateAddressLength,
  sanitizeInput,
  validatePagination,
  validateSelfAction,
  validateStoreUpdate
};