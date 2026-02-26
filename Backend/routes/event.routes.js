import express from 'express';
import { createEvent, getEvents } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ FIX 5: Wired up real createEvent controller instead of mock handler
//           Protected route — user must be logged in to create an event
router.post('/create', protect, createEvent);

// GET all events (public)
router.get('/', getEvents);

export default router;