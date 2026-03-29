import Notification from '../models/Notification.js';

/* GET /api/notifications — student gets their own notifications */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .populate('eventId', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* PUT /api/notifications/:id/read — mark one as read */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { read: true }
    );
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* PUT /api/notifications/read-all — mark all as read */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* Helper — called by registration controller when status changes */
export const createNotification = async (userId, type, title, message, eventId = null) => {
  try {
    await Notification.create({ user_id: userId, type, title, message, event_id: eventId });
  } catch (err) {
    console.error('Create notification error:', err.message);
  }
};