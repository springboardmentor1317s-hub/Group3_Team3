import express from 'express';
import {
  registerForEvent,
  getEventRegistrations,
  updateRegistrationStatus,
  getMyRegistrations
} from '../controllers/Registration.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', protect, authorize('student'), registerForEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:event_id', protect, authorize('college_admin', 'super_admin'), getEventRegistrations);
router.put('/:id/status', protect, authorize('college_admin', 'super_admin'), updateRegistrationStatus);

export default router;