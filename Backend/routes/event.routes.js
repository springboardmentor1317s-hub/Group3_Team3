const express = require('express');
const router = express.Router();

// Mock Create Event API (Temporary)
router.post('/create', (req, res) => {
  try {
    console.log('📤 Event Data:', req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully!',
      event: { ...req.body, id: 'temp123' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
