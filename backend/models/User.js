const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    radius: {
      type: Number,
      default: 5 // km
    }
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  skills: [{
    name: String,
    category: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    hourlyRate: Number
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      showLocation: {
        type: Boolean,
        default: true
      },
      showPhone: {
        type: Boolean,
        default: false
      }
    }
  },
  borrowingHistory: [{
    borrowing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrowing'
    },
    role: {
      type: String,
      enum: ['borrower', 'owner']
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  bcrypt.hash(this.password.trim(), 12)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(next);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword.trim(), this.password);
  } catch (error) {
    return false;
  }
};

// Update ratings
UserSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.ratings.average * this.ratings.count) + newRating;
  this.ratings.count += 1;
  this.ratings.average = totalRating / this.ratings.count;
};

module.exports = mongoose.model('User', UserSchema);