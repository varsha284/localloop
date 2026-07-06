const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in days
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'active', 'returned', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  totalCost: {
    type: Number,
    default: 0
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  approvedAt: Date,
  declineReason: String,
  returnedAt: Date,
  returnCondition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged']
  },
  returnNotes: String,
  rating: {
    borrowerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    ownerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
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
BorrowingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
BorrowingSchema.index({ borrower: 1, status: 1 });
BorrowingSchema.index({ owner: 1, status: 1 });
BorrowingSchema.index({ item: 1 });

module.exports = mongoose.model('Borrowing', BorrowingSchema);