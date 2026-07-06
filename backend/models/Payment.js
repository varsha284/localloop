const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  borrowing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrowing',
    required: true
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'rental', 'damage', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cash'],
    required: true
  },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  description: String,
  metadata: {
    itemName: String,
    rentalDays: Number,
    depositAmount: Number,
    rentalAmount: Number
  },
  fees: {
    platformFee: {
      type: Number,
      default: 0
    },
    processingFee: {
      type: Number,
      default: 0
    },
    totalFees: {
      type: Number,
      default: 0
    }
  },
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    refundId: String
  },
  dispute: {
    reason: String,
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed']
    },
    createdAt: Date,
    resolvedAt: Date,
    resolution: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date
});

// Index for efficient queries
PaymentSchema.index({ borrowing: 1 });
PaymentSchema.index({ payer: 1, status: 1 });
PaymentSchema.index({ payee: 1, status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);