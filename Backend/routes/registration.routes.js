import express from 'express';
import {
  registerForEvent,
  getEventRegistrations,
  updateRegistrationStatus,
  getMyRegistrations
} from '../controllers/registration.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ SPECIFIC routes MUST come BEFORE /:id routes
router.post('/register', protect, authorize('student'), registerForEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:event_id', protect, authorize('college_admin', 'super_admin'), getEventRegistrations);

// ✅ Generic /:id route LAST
router.put('/:id/status', protect, authorize('college_admin', 'super_admin'), updateRegistrationStatus);

export default router;