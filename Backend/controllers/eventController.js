import Event from '../models/Event.js';
import mongoose from 'mongoose';

export const createEvent = async (req, res) => {
  try {
    console.log('📥 Received event data:', req.body);
    console.log('🖼️  Uploaded file:', req.file);

    const {
      title, description, category, location, venue, organizer,
      college_id, start_date, end_date, registration_start,
      registration_end, max_participants, registration_fee,
      event_type, status, tags, requirements, is_featured,
      prizes, schedule, contact, social_links,
      rules_and_regulations, eligibility, certificates,
      certificate_template,
    } = req.body;

    // Safely handle college_id
    let resolvedCollegeId;
    if (college_id && mongoose.Types.ObjectId.isValid(college_id)) {
      resolvedCollegeId = new mongoose.Types.ObjectId(college_id);
    } else {
      resolvedCollegeId = new mongoose.Types.ObjectId();
    }

    // Handle tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
        : String(tags).split(',').map(t => t.trim()).filter(Boolean);
    }

    // These come as real objects from JSON body — NO JSON.parse needed
    const parsedPrizes      = Array.isArray(prizes)      ? prizes      : [];
    const parsedSchedule    = Array.isArray(schedule)     ? schedule    : [];
    const parsedContact     = (contact && typeof contact === 'object')      ? contact     : {};
    const parsedSocialLinks = (social_links && typeof social_links === 'object') ? social_links : {};

    // ✅ Build full URL for image so frontend can display it
    let imageUrl = null;
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newEvent = new Event({
      college_id:            resolvedCollegeId,
      organizer:             organizer || 'Admin',
      title,
      description,
      category,
      location,
      venue:                 venue || '',
      start_date,
      end_date,
      registration_start:    registration_start || new Date(),
      registration_end:      registration_end || end_date,
      max_participants:      max_participants || 100,
      registration_fee:      registration_fee || 0,
      event_type:            event_type || 'offline',
      status:                status || 'published', // ✅ Default to published
      tags:                  parsedTags,
      requirements:          requirements || '',
      is_featured:           is_featured === true || is_featured === 'true',
      prizes:                parsedPrizes,
      schedule:              parsedSchedule,
      contact:               parsedContact,
      social_links:          parsedSocialLinks,
      rules_and_regulations: rules_and_regulations || '',
      eligibility:           eligibility || 'Open to all college students',
      certificates:          certificates === true || certificates === 'true',
      certificate_template:  certificate_template || '',
      image_url:             imageUrl, // ✅ Full URL saved
    });

    const event = await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event,
    });

  } catch (err) {
    console.error('❌ Create event error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error',
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, college_id, date } = req.query;
    let query = {};

    if (category) query.category = category;
    if (college_id) query.college_id = college_id;
    if (date) query.start_date = { $gte: new Date(date) };

    const events = await Event.find(query).sort({ start_date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};








