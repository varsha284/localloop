const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['buying', 'sharing', 'skill_exchange', 'neighborhood', 'interest'],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
  privacy: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  tags: [String],
  rules: [String],
  avatar: String,
  banner: String,
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    },
    totalTransactions: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for location-based queries
GroupSchema.index({ 'location.coordinates': '2dsphere' });
GroupSchema.index({ type: 1, privacy: 1 });

module.exports = mongoose.model('Group', GroupSchema);