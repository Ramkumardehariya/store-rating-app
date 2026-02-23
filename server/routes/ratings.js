const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const Store = require('../models/Store');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  handleValidationErrors, 
  validateRating,
  validateStoreOwnership,
  validatePagination,
  sanitizeInput
} = require('../middleware/validation');
const { ratingValidation } = require('../utils/validators');

// Simple test route
router.get('/test', async (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Ratings test route works' });
});

// Public route for store ratings (no auth required)
router.get('/store/:storeId/ratings', async (req, res) => {
  console.log('Public ratings route hit for storeId:', req.params.storeId);
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const ratings = await Store.getStoreRatings(storeId);
    console.log('Ratings found:', ratings);
    res.json({ ratings });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply authentication middleware to protected routes only
router.use((req, res, next) => {
  // Check if route needs authentication
  if (req.path === '/store/:storeId/ratings' || req.path === '/test') {
    return next(); // Skip auth for public routes
  }
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    User.findById(decoded.userId).then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid token.' });
      }

      req.user = user;
      next();
    }).catch(() => {
      return res.status(401).json({ error: 'Invalid token.' });
    });
  });
});

router.use(sanitizeInput);
router.use(validatePagination);

// User routes (all authenticated users can submit ratings)
router.post('/', 
  authenticate,
  ratingValidation,
  handleValidationErrors,
  validateRating,
  ratingController.submitRating
);

router.get('/user', 
  authenticate,
  ratingController.getUserRatings
);

router.get('/store/:storeId', 
  authenticate,
  authorize('admin', 'store_owner'),
  ratingController.getStoreWithUserRating
);

module.exports = router;