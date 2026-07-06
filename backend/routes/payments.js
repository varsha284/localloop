const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Payment = require('../models/Payment');
const Borrowing = require('../models/Borrowing');
const { auth } = require('../middleware/auth');

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { borrowingId, amount, type } = req.body;

    const borrowing = await Borrowing.findById(borrowingId)
      .populate('item')
      .populate('borrower')
      .populate('owner');

    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing not found' });
    }

    // Verify user is involved in the borrowing
    if (borrowing.borrower._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Calculate platform fee (5%)
    const platformFee = Math.round(amount * 0.05);
    const totalAmount = amount + platformFee;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        borrowingId: borrowingId,
        type: type,
        itemName: borrowing.item.name
      }
    });

    // Create payment record
    const payment = new Payment({
      borrowing: borrowingId,
      payer: req.user.id,
      payee: borrowing.owner._id,
      type: type,
      amount: amount,
      status: 'pending',
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      fees: {
        platformFee: platformFee,
        totalFees: platformFee
      },
      metadata: {
        itemName: borrowing.item.name,
        rentalDays: borrowing.duration,
        depositAmount: type === 'deposit' ? amount : 0,
        rentalAmount: type === 'rental' ? amount : 0
      }
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
});

// Confirm payment
router.post('/confirm/:paymentId', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId
    );

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.stripeChargeId = paymentIntent.charges.data[0].id;
      await payment.save();

      // Update borrowing status if deposit is paid
      if (payment.type === 'deposit') {
        await Borrowing.findByIdAndUpdate(payment.borrowing, {
          status: 'confirmed',
          depositPaid: true
        });
      }

      res.json({ message: 'Payment confirmed', payment });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ error: 'Payment failed' });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Error confirming payment' });
  }
});

// Get user payments
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {
      $or: [
        { payer: req.user.id },
        { payee: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('borrowing')
      .populate('payer', 'name email')
      .populate('payee', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Process refund
router.post('/refund/:paymentId', auth, async (req, res) => {
  try {
    const { reason, amount } = req.body;
    const payment = await Payment.findById(req.params.paymentId)
      .populate('borrowing');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Verify user is the payee (item owner)
    if (payment.payee.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Payment not eligible for refund' });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      charge: payment.stripeChargeId,
      amount: (amount || payment.amount) * 100, // Convert to cents
      reason: 'requested_by_customer'
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refund = {
      amount: amount || payment.amount,
      reason: reason,
      processedAt: new Date(),
      refundId: refund.id
    };
    await payment.save();

    res.json({ message: 'Refund processed successfully', payment });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Error processing refund' });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { 
            status: 'completed',
            completedAt: new Date()
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          { status: 'failed' }
        );
        break;
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

module.exports = router;