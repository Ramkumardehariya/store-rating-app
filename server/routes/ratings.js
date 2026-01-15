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

// User routes (all authenticated users can submit ratings)
router.post('/submitRating', 
  ratingValidation,
  handleValidationErrors,
  validateRating,
  ratingController.submitRating
);

router.get('/getUserRating', ratingController.getUserRatings);

router.get('/store/rating/:storeId', 
  validateStoreOwnership,
  ratingController.getStoreWithUserRating
);

module.exports = router;