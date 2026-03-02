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

// GET all events (public)
router.get('/', getEvents);

// GET single event by ID (public)
router.get('/:id', getEventById);

// POST create event — handles multipart/form-data with optional image
router.post('/create_events', protect, authorize('college_admin', 'super_admin'), handleUpload, createEvent);

// PUT update event — handles multipart/form-data with optional image
router.put('/:id', protect, authorize('college_admin', 'super_admin'), handleUpload, updateEvent);

// DELETE event
router.delete('/:id', protect, authorize('college_admin', 'super_admin'), deleteEvent);

export default router;
