const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  handleValidationErrors, 
  validateRating,
  validateStoreOwnership,
  validatePagination,
  sanitizeInput
} = require('../middleware/validation');
const { ratingValidation } = require('../utils/validators');

// Apply middleware to all routes
router.use(authenticate);
router.use(sanitizeInput);
router.use(validatePagination);

// User routes
router.post('/submitRating', 
  authorize('user'),
  ratingValidation,
  handleValidationErrors,
  validateRating,
  validateStoreOwnership,
  ratingController.submitRating
);

router.get('/getUserRating', 
  authorize('user'),
  ratingController.getUserRatings
);

router.get('/store/rating/:storeId', 
  authorize('user'),
  validateStoreOwnership,
  ratingController.getStoreWithUserRating
);

module.exports = router;