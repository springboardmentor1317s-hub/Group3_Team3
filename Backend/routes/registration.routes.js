import express from 'express';
import {
  registerForEvent,
  getEventRegistrations,
  updateRegistrationStatus,
  getMyRegistrations
} from '../controllers/registration.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student: register for an event
router.post('/register', protect, authorize('student'), registerForEvent);

// Student: view own registrations
router.get('/my', protect, authorize('student'), getMyRegistrations);

// Admin: view all participants for an event
router.get('/event/:event_id', protect, authorize('college_admin', 'super_admin'), getEventRegistrations);

// Admin: approve or reject a registration  ← fixed from /manage to /:id/status
router.put('/:id/status', protect, authorize('college_admin', 'super_admin'), updateRegistrationStatus);

export default router;






