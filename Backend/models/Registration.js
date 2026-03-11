const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  college: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
