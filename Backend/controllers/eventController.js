import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    // ✅ Destructure all fields sent from the CreateEvent frontend form
    const {
      title,
      description,
      category,
      location,
      venue,
      organizer,
      start_date,
      end_date,
      registration_start,
      registration_end,
      max_participants,
      registration_fee,
      event_type,
      status,
      tags,
      requirements,
      is_featured,
      prizes,
      schedule,
      contact,
      social_links,
      rules_and_regulations,
      eligibility,
      certificates,
      certificate_template,
    } = req.body;

    const newEvent = new Event({
      // college_id comes from the logged-in user (via protect middleware)
      college_id: req.user.id,
      organizer: organizer || req.user.name || 'Admin',
      title,
      description,
      category,
      location,
      venue,
      start_date,
      end_date,
      registration_start: registration_start || Date.now(),
      // registration_end falls back to end_date if not provided
      registration_end: registration_end || end_date,
      max_participants,
      registration_fee,
      event_type,
      status: status || 'draft',
      tags,
      requirements,
      is_featured,
      // Parse JSON strings back to objects/arrays (sent as JSON.stringify from FormData)
      prizes: prizes ? JSON.parse(prizes) : [],
      schedule: schedule ? JSON.parse(schedule) : [],
      contact: contact ? JSON.parse(contact) : {},
      social_links: social_links ? JSON.parse(social_links) : {},
      rules_and_regulations,
      eligibility,
      certificates,
      certificate_template,
      // Handle uploaded image file if present
      image_url: req.file ? req.file.path : undefined,
    });

    const event = await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event,
    });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
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