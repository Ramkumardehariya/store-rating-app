const { body } = require('express-validator');

const nameValidator = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailValidator = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const addressValidator = body('address')
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters');

const passwordValidator = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
  .withMessage('Password must contain at least one uppercase letter and one special character');

const ratingValidator = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be between 1 and 5');

const roleValidator = body('role')
  .isIn(['admin', 'user', 'store_owner'])
  .withMessage('Invalid role');

// Validation chains
const registerValidation = [
  nameValidator,
  emailValidator,
  addressValidator,
  passwordValidator
];

const loginValidation = [
  emailValidator,
  body('password').notEmpty().withMessage('Password is required')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordValidator
];

const createUserValidation = [
  nameValidator,
  emailValidator,
  addressValidator,
  passwordValidator,
  roleValidator.optional()
];

const createStoreValidation = [
  nameValidator,
  emailValidator,
  addressValidator,
  body('owner_id').isInt().withMessage('Owner ID must be a valid integer'),
];

const ratingValidation = [
  ratingValidator,
  body('store_id').isInt().withMessage('Store ID must be a valid integer')
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  createUserValidation,
  createStoreValidation,
  ratingValidation
};