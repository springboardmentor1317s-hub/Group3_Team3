import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['registration_approved', 'registration_rejected', 'registration_pending'],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null
    },
    read: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'notifications' }
);

notificationSchema.index({ user_id: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;