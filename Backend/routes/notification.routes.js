import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ /read-all MUST come BEFORE /:id/read — otherwise Express matches "read-all" as an :id
router.get('/',             protect, getMyNotifications);
router.put('/read-all',     protect, markAllAsRead);
router.put('/:id/read',     protect, markAsRead);

export default router;