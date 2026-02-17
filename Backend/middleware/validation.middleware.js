import { body, validationResult } from 'express-validator';

/**
 * Validation middleware to check for errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log errors for debugging
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Registration validation rules - RELAXED for frontend compatibility
 */
export const registerValidation = [
  // Accept EITHER name OR fullName
  body().custom((value, { req }) => {
    const userName = req.body.name || req.body.fullName;
    if (!userName || userName.trim().length === 0) {
      throw new Error('Name is required');
    }
    // Set name field for backend processing
    req.body.name = userName.trim();
    return true;
  }),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  // RELAXED password validation - just check it exists and has min length
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('college')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),
  
  // Map accountType to role if needed
  body().custom((value, { req }) => {
    if (req.body.accountType && !req.body.role) {
      const accountType = req.body.accountType;
      if (accountType === 'Student') req.body.role = 'student';
      else if (accountType === 'College Admin') req.body.role = 'college_admin';
      else if (accountType === 'Super Admin') req.body.role = 'super_admin';
    }
    return true;
  }),
  
  validate
];

/**
 * Login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

/**
 * Update profile validation rules
 */
export const updateProfileValidation = [
  body(['name', 'fullName'])
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('college')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('College name cannot be empty'),
  
  validate
];

/**
 * Change password validation rules
 */
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  validate
];