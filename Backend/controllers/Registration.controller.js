import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';

// ─────────────────────────────────────────────────────────────
// POST /api/registrations/register
// Access: Student only
// ─────────────────────────────────────────────────────────────
export const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user._id;

    // Check event exists
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check event is published
    if (event.status !== 'published') {
      return res.status(400).json({ success: false, message: 'This event is not open for registration' });
    }

    // Check registration deadline
    const now = new Date();
    if (now > event.registration_end) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Check if event is full
    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ success: false, message: 'Event is full. No slots available' });
    }

    // Check duplicate registration
    const existing = await Registration.findOne({ event_id, user_id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }

    // Create registration
    const registration = await Registration.create({ event_id, user_id, status: 'pending' });

    // Increment participant count
    event.current_participants += 1;
    await event.save();

    // Notify the college admin who owns the event
    await Notification.create({
      recipient: event.college_id,
      sender: user_id,
      type: 'admin_approval_request',
      title: 'New Registration Pending',
      message: `${req.user.name} has registered for "${event.title}" and is awaiting your approval.`,
      relatedEvent: event._id,
      relatedRegistration: registration._id,
      relatedUser: user_id,
    });

    // Notify the student their registration was received
    await Notification.create({
      recipient: user_id,
      sender: null,
      type: 'event_registration',
      title: 'Registration Received',
      message: `Your registration for "${event.title}" has been received and is pending approval.`,
      relatedEvent: event._id,
      relatedRegistration: registration._id,
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully. Awaiting admin approval.',
      data: { registration },
    });
  } catch (error) {
    // MongoDB duplicate key — race condition safety net
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }
    console.error('registerForEvent error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/registrations/my
// Access: Student only
// ─────────────────────────────────────────────────────────────
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user_id: req.user._id })
      .populate('event_id', 'title category start_date end_date location status image_url organizer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: { registrations },
    });
  } catch (error) {
    console.error('getMyRegistrations error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/registrations/event/:event_id
// Access: college_admin, super_admin
// ─────────────────────────────────────────────────────────────
export const getEventRegistrations = async (req, res) => {
  try {
    const { event_id } = req.params;

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // College admins can only see registrations for their own events
    if (req.user.role === 'college_admin' && event.college_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view registrations for this event' });
    }

    const registrations = await Registration.find({ event_id })
      .populate('user_id', 'name email college department year phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: { registrations },
    });
  } catch (error) {
    console.error('getEventRegistrations error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/registrations/:id/status
// Access: college_admin, super_admin
// Body: { status: 'approved' | 'rejected' }
// ─────────────────────────────────────────────────────────────
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const event = await Event.findById(registration.event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // College admin can only update registrations for their own events
    if (req.user.role === 'college_admin' && event.college_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this registration' });
    }

    // Prevent updating an already-decided registration
    if (registration.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Registration is already ${registration.status}` });
    }

    registration.status = status;
    await registration.save();

    // Notify the student of the decision
    await Notification.create({
      recipient: registration.user_id,
      sender: req.user._id,
      type: status === 'approved' ? 'registration_approved' : 'registration_rejected',
      title: status === 'approved' ? 'Registration Approved! 🎉' : 'Registration Rejected',
      message:
        status === 'approved'
          ? `Your registration for "${event.title}" has been approved. We look forward to seeing you!`
          : `Your registration for "${event.title}" has been rejected. Please contact the organiser for more details.`,
      relatedEvent: event._id,
      relatedRegistration: registration._id,
      relatedUser: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: `Registration ${status} successfully`,
      data: { registration },
    });
  } catch (error) {
    console.error('updateRegistrationStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};