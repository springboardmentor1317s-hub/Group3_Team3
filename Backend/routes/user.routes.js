import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserById, // ✅ NEW
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

// ── Own profile routes ────────────────────────────────────────────
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);

// ── Admin / Super Admin routes ────────────────────────────────────
router.get('/', authorize('college_admin', 'super_admin'), getAllUsers);
router.get('/:id', authorize('college_admin', 'super_admin'), getUserById);

// ✅ FIXED: Added PUT /:id so Super Admin can approve/update college admins
router.put('/:id', authorize('super_admin'), updateUserById);

router.delete('/:id', authorize('college_admin', 'super_admin'), deleteUser);

export default router;