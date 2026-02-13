const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Sports', 'Hackathon', 'Cultural', 'Workshop'], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    college: { type: String, required: true }, 
    capacity: { type: Number, required: true },
    registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);