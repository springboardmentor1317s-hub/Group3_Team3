import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    target_type: {
      type: String,
      enum: ['user', 'event', 'registration', 'feedback', 'comment', 'system'],
      default: 'system'
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    ip_address: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, collection: 'admin_logs' }
);

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;