import mongoose from "mongoose";
import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const {
      title, description, category, location, venue, organizer,
      start_date, end_date, registration_start, registration_end,
      max_participants, registration_fee, event_type, status, tags,
      requirements, is_featured, prizes, schedule, contact,
      social_links, rules_and_regulations, eligibility, certificates,
      certificate_template,
    } = req.body;

    const newEvent = new Event({
      college_id: req.user.id,
      organizer: organizer || req.user.name || 'Admin',
      title, description, category, location, venue,
      start_date, end_date,
      registration_start: registration_start || Date.now(),
      registration_end: registration_end || end_date,
      max_participants, registration_fee, event_type,
      status: status || 'published',
      tags,
      requirements,
      is_featured,
      prizes: prizes ? JSON.parse(prizes) : [],
      schedule: schedule ? JSON.parse(schedule) : [],
      contact: contact ? JSON.parse(contact) : {},
      social_links: social_links ? JSON.parse(social_links) : {},
      rules_and_regulations, eligibility, certificates,
      certificate_template,
      image_url: req.file ? `/uploads/events/${req.file.filename}` : undefined,
    });

    const event = await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully!', event });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, college_id, date, search, status } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (college_id) query.college_id = college_id;
    if (status && status !== 'all') query.status = status;
    if (date) query.start_date = { $gte: new Date(date) };
    if (search) query.title = { $regex: search, $options: 'i' };

    const events = await Event.find(query).sort({ start_date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// check path

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    // ✅ 2. Fetch event (NO populate first)
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ 3. Return
    res.status(200).json({ event });

  } catch (error) {
    console.error("❌ ERROR in getEventById:", error);
    res.status(500).json({
      message: "Server error while fetching event",
      error: error.message, // 👈 helps debug
    });
  }
};


export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.college_id.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    const updates = { ...req.body, updated_at: Date.now() };
    if (req.file) updates.image_url = `/uploads/events/${req.file.filename}`;

    const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Event updated successfully', event: updated });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.college_id.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};








