import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { createLog } from './adminLog.controller.js';
import { createNotification } from './notification.controller.js';

/* Student registers for an event */
export const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ success: false, message: 'Event is already full' });
    }

    const existing = await Registration.findOne({ event_id, user_id: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }

    const registration = await Registration.create({
      event_id,
      user_id: req.user._id,
      status: 'pending'
    });

    // Notify student that registration is pending
    await createNotification(
      req.user._id,
      'registration_pending',
      'Registration Submitted',
      `Your registration for "${event.title}" has been submitted and is awaiting approval.`,
      event_id
    );

    res.status(201).json({ success: true, message: 'Registered successfully! Awaiting admin approval.', registration });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/* Admin views all participants for an event */
export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event_id: req.params.event_id })
      .populate('user_id', 'name email college');

    res.json({ success: true, registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* Admin approve or reject a registration */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const previousStatus = registration.status;
    registration.status = status;
    await registration.save();

    // Increment participant count only when newly approved
    if (status === 'approved' && previousStatus !== 'approved') {
      const event = await Event.findById(registration.event_id);
      if (event) await event.addParticipant();
    }

    // Decrement if un-approving a previously approved registration
    if (previousStatus === 'approved' && status !== 'approved') {
      const event = await Event.findById(registration.event_id);
      if (event) await event.removeParticipant();
    }

    // Send notification to student
    const event = await Event.findById(registration.event_id);
    if (status === 'approved') {
      await createNotification(
        registration.user_id,
        'registration_approved',
        'Registration Approved! 🎉',
        `Your registration for "${event?.title}" has been approved! See you there.`,
        registration.event_id
      );
    } else if (status === 'rejected') {
      await createNotification(
        registration.user_id,
        'registration_rejected',
        'Registration Rejected',
        `Your registration for "${event?.title}" was not approved. Please contact the organizer.`,
        registration.event_id
      );
    }

    res.json({ success: true, message: `Registration ${status}`, registration });

    // Log admin action
    await createLog(
      req.user._id,
      `${status.charAt(0).toUpperCase() + status.slice(1)} registration ${req.params.id}`,
      'registration',
      req.params.id,
      req.ip
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* Student views their own registrations */
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user_id: req.user._id })
      .populate('event_id', 'title description category start_date end_date location status image_url college_id');

    res.json({ success: true, registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};