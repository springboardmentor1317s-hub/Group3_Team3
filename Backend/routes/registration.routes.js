import express from 'express';
import {
registerForEvent,
getEventRegistrations,
updateRegistrationStatus
} from '../controllers/registration.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

/* Student registers */
router.post('/register', protect, authorize('student'), registerForEvent);

/* Admin view participants */
router.get('/event/:event_id', protect, authorize('college_admin','super_admin'), getEventRegistrations);

/* Admin approve/reject */
router.put('/:id/status', protect, authorize('college_admin','super_admin'), updateRegistrationStatus);

export default router;
