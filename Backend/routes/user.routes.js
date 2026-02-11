import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  updateProfileValidation,
  changePasswordValidation
} from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', updateProfileValidation, updateProfile);

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', changePasswordValidation, changePassword);

// Admin only routes
/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', authorize('college_admin', 'super_admin'), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private/Admin
 */
router.get('/:id', authorize('college_admin', 'super_admin'), getUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authorize('college_admin', 'super_admin'), deleteUser);

export default router;