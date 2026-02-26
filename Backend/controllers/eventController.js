import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, start_date, end_date } = req.body;

    const newEvent = new Event({
      college_id: req.user.id,
      organizer: req.user.name || 'Admin',
      title,
      description,
      category,
      location,
      start_date,
      end_date,
      registration_end: end_date
    });

    const event = await newEvent.save();
    res.status(201).json(event);
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
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};