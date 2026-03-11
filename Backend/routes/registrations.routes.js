// ✅ routes/registrations.js - COMPLETE APPROVAL FLOW
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Student = require('../models/Student'); // Your User model
const Notification = require('../models/Notification');

// ✅ 1. STUDENT REGISTERS (PENDING)
router.post('/events/:eventId/register', async (req, res) => {
  try {
    const { studentId, fullName, email, phone, college, status = 'pending' } = req.body;
    const eventId = req.params.eventId;

    // Check if already registered
    const existing = await Registration.findOne({ 
      studentId, 
      eventId,
      status: { $in: ['pending', 'approved'] }
    });
    if (existing) {
      return res.status(400).json({ error: 'Already registered!' });
    }

    // Check event capacity
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const registration = new Registration({
      eventId,
      studentId,
      studentName: fullName,
      email,
      phone,
      college,
      status: 'pending'
    });
    await registration.save();

    // Update event participant count
    event.current_participants = (event.current_participants || 0) + 1;
    await event.save();

    // ✅ SEND ADMIN NOTIFICATION
    await Notification.create({
      to: 'admin',
      from: studentId,
      type: 'new_registration',
      title: 'New Registration Request',
      message: `${fullName} registered for ${event.title}`,
      eventId,
      registrationId: registration._id,
      read: false
    });

    res.json({ 
      success: true, 
      message: 'Registration submitted for approval!',
      registration 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ 2. ADMIN GET PENDING REGISTRATIONS
router.get('/pending', async (req, res) => {
  try {
    const pending = await Registration.find({ status: 'pending' })
      .populate('eventId', 'title location start_date')
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json({ registrations: pending });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending registrations' });
  }
});

// ✅ 3. ADMIN APPROVE
router.put('/registrations/:id/approve', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    ).populate('eventId', 'title');

    // ✅ SEND STUDENT NOTIFICATION
    await Notification.create({
      to: registration.studentId,
      from: 'admin',
      type: 'registration_approved',
      title: 'Registration Approved! 🎉',
      message: `Your registration for "${registration.eventId.title}" has been approved!`,
      eventId: registration.eventId,
      registrationId: registration._id,
      read: false
    });

    res.json({ 
      success: true, 
      message: 'Registration approved!',
      registration 
    });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// ✅ 4. ADMIN REJECT
router.put('/registrations/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected', 
        rejectedAt: new Date(),
        rejectionReason: reason 
      },
      { new: true }
    ).populate('eventId', 'title');

    // ✅ SEND STUDENT REJECTION NOTIFICATION
    await Notification.create({
      to: registration.studentId,
      from: 'admin',
      type: 'registration_rejected',
      title: 'Registration Rejected 😞',
      message: `Your registration for "${registration.eventId.title}" was rejected. Reason: ${reason || 'Not specified'}`,
      eventId: registration.eventId,
      registrationId: registration._id,
      read: false
    });

    res.json({ 
      success: true, 
      message: 'Registration rejected!',
      registration 
    });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
});

// ✅ 5. STUDENT GET MY REGISTRATIONS
router.get('/students/:studentId/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.params.studentId })
      .populate('eventId', 'title location start_date description max_participants')
      .sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// ✅ 6. GET ALL REGISTRATIONS (Admin)
router.get('/', async (req, res) => {
  try {
    const { status, eventId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (eventId) query.eventId = eventId;
    
    const registrations = await Registration.find(query)
      .populate('eventId', 'title')
      .populate('studentId', 'fullName email college')
      .sort({ createdAt: -1 });
      
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

module.exports = router;
