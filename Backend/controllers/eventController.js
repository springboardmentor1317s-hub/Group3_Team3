import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { handleUpload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/create', protect, authorize('college_admin', 'super_admin'), handleUpload, createEvent);
router.put('/:id', protect, authorize('college_admin', 'super_admin'), handleUpload, updateEvent);
router.delete('/:id', protect, authorize('college_admin', 'super_admin'), deleteEvent);

export default router;






