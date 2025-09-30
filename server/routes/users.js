const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  handleValidationErrors, 
  validateQueryParams,
  validateUniqueEmail,
  validateRole,
  validateUserExists,
  validatePagination,
  validateSelfAction,
  sanitizeInput
} = require('../middleware/validation');
const { createUserValidation } = require('../utils/validators');

// Apply middleware to all routes
router.use(authenticate);
router.use(authorize('admin'));
router.use(sanitizeInput);
router.use(validateQueryParams);
router.use(validatePagination);

router.post('/createUser', 
  createUserValidation,
  handleValidationErrors,
  validateUniqueEmail('user'),
  validateRole,
  userController.createUser
);

router.get('/getAllUsers', userController.getAllUsers);
router.get('/dashboard/stats', userController.getDashboardStats);

router.get('/getUserById/:id', 
  validateUserExists,
  userController.getUserById
);

module.exports = router;