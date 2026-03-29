import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['sports', 'hackathon', 'cultural', 'workshop', 'seminar', 'social', 'technical', 'other'],
      default: 'other'
    },
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: [true, 'College organizer is required']
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true
    },
    venue: {
      type: String,
      trim: true
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required']
    },
    registration_start: {
      type: Date,
      default: Date.now
    },
    registration_end: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    max_participants: {
      type: Number,
      default: 100,
      min: [1, 'Must allow at least 1 participant']
    },
    current_participants: {
      type: Number,
      default: 0
    },
    registration_fee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative']
    },
    event_type: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline'
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
      default: 'published'
    },
    image_url: {
      type: String,
      default: null
    },
    tags: [{
      type: String,
      trim: true
    }],
    requirements: {
      type: String,
      default: null
    },
    prizes: [{
      position: String,
      prize: String,
      amount: Number
    }],
    schedule: [{
      time: String,
      activity: String,
      description: String
    }],
    contact: {
      email: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true
      }
    },
    social_links: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    },
    rules_and_regulations: {
      type: String,
      default: null
    },
    eligibility: {
      type: String,
      default: 'Open to all college students'
    },
    certificates: {
      type: Boolean,
      default: false
    },
    certificate_template: {
      type: String,
      default: null
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'events'
  }
);

// Update the updated_at field before saving
eventSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return (
    this.status === 'published' &&
    now >= this.registration_start &&
    now <= this.registration_end &&
    this.current_participants < this.max_participants
  );
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.current_participants >= this.max_participants;
});

// Virtual for remaining slots
eventSchema.virtual('remainingSlots').get(function() {
  return Math.max(0, this.max_participants - this.current_participants);
});

// Method to increment participant count
eventSchema.methods.addParticipant = async function() {
  if (this.current_participants < this.max_participants) {
    this.current_participants += 1;
    await this.save();
    return true;
  }
  return false;
};

// Method to decrement participant count
eventSchema.methods.removeParticipant = async function() {
  if (this.current_participants > 0) {
    this.current_participants -= 1;
    await this.save();
    return true;
  }
  return false;
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    start_date: { $gte: new Date() },
    status: 'published'
  })
  .sort({ start_date: 1 })
  .limit(limit);
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({
    category: category,
    status: 'published',
    start_date: { $gte: new Date() }
  })
  .sort({ start_date: 1 })
  .limit(limit);
};

// Static method to find featured events
eventSchema.statics.findFeatured = function(limit = 5) {
  return this.find({
    is_featured: true,
    status: 'published',
    start_date: { $gte: new Date() }
  })
  .sort({ start_date: 1 })
  .limit(limit);
};

// Index for better query performance
eventSchema.index({ start_date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ college_id: 1 });
eventSchema.index({ is_featured: 1 });
eventSchema.index({ created_at: -1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;