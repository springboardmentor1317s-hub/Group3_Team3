import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

// Register route
router.post('/register', registerValidation, register);

// Login route
router.post('/login', loginValidation, login);

// Logout route
router.post('/logout', protect, logout);

// Get current user
router.get('/me', protect, getMe);

export default router;  // ← IMPORTANT: Must be 'export default'