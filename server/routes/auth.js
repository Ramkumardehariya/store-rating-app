const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { 
  handleValidationErrors, 
  validateUniqueEmail,
  validatePasswordStrength,
  validateNameLength,
  validateAddressLength,
  sanitizeInput
} = require('../middleware/validation');
const { registerValidation, loginValidation, updatePasswordValidation } = require('../utils/validators');

// Apply sanitization to all routes
router.use(sanitizeInput);

router.post('/register', 
  registerValidation,
  handleValidationErrors,
  validateUniqueEmail('user'),
  validateNameLength,
  validateAddressLength,
  validatePasswordStrength,
  authController.register
);

router.post('/login', 
  loginValidation,
  handleValidationErrors,
  authController.login
);

router.get('/me', authenticate, authController.getMe);

router.put('/update-password', 
  authenticate, 
  updatePasswordValidation,
  handleValidationErrors,
  validatePasswordStrength,
  authController.updatePassword
);

module.exports = router;