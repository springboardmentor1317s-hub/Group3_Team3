import Notification from '../models/Notification.js';

/* GET /api/notifications — get logged-in user's notifications */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('relatedEvent', 'title category')
      .populate('sender', 'name')
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* PUT /api/notifications/read-all — mark ALL as read (must be BEFORE /:id) */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* PUT /api/notifications/:id/read — mark one as read */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Marked as read', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/* Helper — called by other controllers to create a notification */
export const createNotification = async (recipientId, type, title, message, eventId = null) => {
  try {
    await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedEvent: eventId,
    });
  } catch (err) {
    console.error('Create notification error:', err.message);
  }
};