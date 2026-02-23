const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

console.log('Stores routes file loaded');

const { authenticate, authorize } = require('../middleware/auth');
const { 
  handleValidationErrors, 
  validateQueryParams,
  validateUniqueEmail,
  validateUserExists,
  validatePagination,
  sanitizeInput,
  validateStoreUpdate
} = require('../middleware/validation');
const { createStoreValidation } = require('../utils/validators');

// Apply middleware to public routes (except ratings route for testing)
// router.use(sanitizeInput);
// router.use(validateQueryParams);
// router.use(validatePagination);

// Public routes - simplified for testing
router.get('/', storeController.getAllStores);
router.get('/test', (req, res) => res.json({ message: 'Test route works' }));
router.get('/:id', storeController.getStoreById);

// Ratings route - added at the end
router.get('/:id/ratings', storeController.getStoreRatings);

// Admin only routes
router.post('/create-store', 
  authenticate, 
  authorize('admin'),
  createStoreValidation,
  handleValidationErrors,
  validateUniqueEmail('store'),
  validateUserExists,
  storeController.createStore
);

// Store owner routes
router.get('/owner/dashboard', 
  authenticate, 
  authorize('store_owner'),
  storeController.getStoreOwnerDashboard
);

// Store update routes - accessible by admin and store owners
router.put('/:id', 
  authenticate, 
  authorize('admin', 'store_owner'),
  validateStoreUpdate,
  handleValidationErrors,
  validateUserExists,
  storeController.updateStore
);

module.exports = router;