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

// User routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);

// Admin routes
router.get('/', authorize('college_admin', 'super_admin'), getAllUsers);
router.get('/:id', authorize('college_admin', 'super_admin'), getUserById);
router.delete('/:id', authorize('college_admin', 'super_admin'), deleteUser);

export default router;  // ← IMPORTANT: Must be 'export default'