const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  to: { type: String, required: true }, // studentId or 'admin'
  from: { type: String, required: true },
  type: String,
  title: String,
  message: String,
  eventId: mongoose.Schema.Types.ObjectId,
  registrationId: mongoose.Schema.Types.ObjectId,
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
