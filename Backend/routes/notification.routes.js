import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student: get their notifications
router.get('/', protect, getMyNotifications);

// Mark one as read
router.put('/:id/read', protect, markAsRead);

// Mark all as read
router.put('/read-all', protect, markAllAsRead);

export default router;