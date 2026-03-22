import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    college: {
      type: String,
      // ✅ FIXED: college is NOT required for super_admin
      // Validation is handled via custom validator below
      trim: true,
      default: null
    },
    role: {
      type: String,
      enum: ['student', 'college_admin', 'super_admin'],
      default: 'student'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    profilePicture: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: null
    },
    department: {
      type: String,
      default: null
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    interests: [{
      type: String
    }],
    socialLinks: {
      linkedin: { type: String, default: null },
      github: { type: String, default: null },
      twitter: { type: String, default: null }
    },
    registeredEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    attendedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    certificates: [{
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      },
      certificateUrl: String,
      issuedAt: {
        type: Date,
        default: Date.now
      }
    }],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// ✅ FIXED: Custom validator — college required only for student and college_admin
userSchema.pre('validate', function (next) {
  if (this.role !== 'super_admin' && !this.college) {
    this.invalidate('college', 'College name is required for students and college admins');
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function () {
  let completed = 0;
  const fields = ['name', 'email', 'college', 'phone', 'bio', 'department', 'year', 'profilePicture'];

  fields.forEach(field => {
    if (this[field] && this[field] !== null && this[field] !== '') {
      completed++;
    }
  });

  if (this.interests && this.interests.length > 0) completed++;
  if (this.socialLinks && (this.socialLinks.linkedin || this.socialLinks.github)) completed++;

  return Math.round((completed / (fields.length + 2)) * 100);
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ college: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;