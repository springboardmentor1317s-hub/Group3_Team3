import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

// ==================== CRITICAL: THESE ROUTES MUST EXIST ====================

// Register routes - Support BOTH /register and /signup
router.post('/register', registerValidation, register);
router.post('/signup', registerValidation, register);  // ← FRONTEND NEEDS THIS!

// Login routes - Support BOTH /login and /signin  
router.post('/login', loginValidation, login);
router.post('/signin', loginValidation, login);  // ← FRONTEND NEEDS THIS!

// ===========================================================================

// Logout route
router.post('/logout', protect, logout);

// Get current user
router.get('/me', protect, getMe);

export default router;