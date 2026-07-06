const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
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
    enum: ['tools', 'kitchen', 'electronics', 'books', 'sports', 'gardening', 'automotive', 'furniture', 'clothing', 'toys', 'music', 'art', 'other']
  },
  subcategory: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  availability: {
    type: String,
    enum: ['available', 'borrowed', 'unavailable', 'maintenance'],
    default: 'available'
  },
  availabilityCalendar: [{
    date: { type: Date },
    status: {
      type: String,
      enum: ['available', 'booked', 'unavailable'],
      default: 'available'
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  pricing: {
    dailyRate: {
      type: Number,
      default: 0
    },
    weeklyRate: {
      type: Number,
      default: 0
    },
    monthlyRate: {
      type: Number,
      default: 0
    },
    depositRequired: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  images: [{
    url: String,
    publicId: String, // for Cloudinary
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'good'
  },
  specifications: {
    brand: String,
    model: String,
    year: Number,
    size: String,
    weight: String,
    color: String,
    material: String
  },
  tags: [String],
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
  borrowingRules: {
    minBorrowDays: {
      type: Number,
      default: 1
    },
    maxBorrowDays: {
      type: Number,
      default: 30
    },
    advanceBookingDays: {
      type: Number,
      default: 7
    },
    requiresApproval: {
      type: Boolean,
      default: true
    },
    instantBooking: {
      type: Boolean,
      default: false
    }
  },
  insurance: {
    covered: {
      type: Boolean,
      default: false
    },
    provider: String,
    policyNumber: String,
    coverage: Number
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmergencyItem: {
    type: Boolean,
    default: false
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
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

// Update the updatedAt field before saving
ItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search
ItemSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text'
});

// Add geospatial index for location-based queries
ItemSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Item', ItemSchema);
