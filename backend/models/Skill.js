const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'tutoring',
      'home_repair',
      'gardening',
      'cooking',
      'technology',
      'fitness',
      'music',
      'art',
      'language',
      'business',
      'crafts',
      'automotive',
      'pet_care',
      'childcare',
      'elderly_care',
      'other'
    ]
  },
  subcategory: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'exchange', 'paid'],
      default: 'exchange'
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    exchangeFor: [String] // What they want in exchange
  },
  availability: {
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String
    }],
    timezone: String,
    isFlexible: {
      type: Boolean,
      default: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'in_person', 'both'],
      default: 'both'
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    radius: {
      type: Number,
      default: 10 // km for in-person services
    }
  },
  requirements: {
    experience: String,
    equipment: [String],
    prerequisites: [String]
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    credentialId: String
  }],
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
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
SkillSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  tags: 'text'
});

// Geospatial index
SkillSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Skill', SkillSchema);