import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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

export const registerValidation = [
  // Normalize fullName → name and accountType → role before validation
  (req, res, next) => {
    if (!req.body.name && req.body.fullName) {
      req.body.name = req.body.fullName.trim();
    }
    if (req.body.accountType && !req.body.role) {
      const roleMap = {
        'Student': 'student',
        'College Admin': 'college_admin',
        'Super Admin': 'super_admin',
      };
      req.body.role = roleMap[req.body.accountType] || 'student';
    }
    next();
  },

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  // ✅ FIXED: college is only required when role is NOT super_admin
  body('college').custom((value, { req }) => {
    const role = req.body.role || 'student';
    if (role !== 'super_admin') {
      if (!value || value.trim() === '') {
        throw new Error('College name is required');
      }
    }
    return true;
  }),

  validate
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate
];

export const updateProfileValidation = [
  body('name')
    .optional().trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('college')
    .optional().trim()
    .notEmpty().withMessage('College name cannot be empty'),

  validate
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('Passwords do not match');
      return true;
    }),

  validate
];