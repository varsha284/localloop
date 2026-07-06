const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');
const { createNotification } = require('./notifications');

// Get user's borrowings
router.get('/', auth, async (req, res) => {
  try {
    const { status, role } = req.query;
    
    let query = {
      $or: [
        { borrower: req.user.id },
        { owner: req.user.id }
      ]
    };
    
    if (status) {
      query.status = status;
    }
    
    const borrowings = await Borrowing.find(query)
      .populate('item', 'name category images')
      .populate('borrower', 'name email avatar')
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json({ borrowings });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching borrowings' });
  }
});

// Create borrowing request
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, startDate, endDate, message } = req.body;
    
    const item = await Item.findById(itemId).populate('owner');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (item.owner._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot borrow your own item' });
    }
    
    // Check availability
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const borrowing = new Borrowing({
      item: itemId,
      borrower: req.user.id,
      owner: item.owner._id,
      startDate: start,
      endDate: end,
      duration: days,
      totalCost: days * (item.pricing?.dailyRate || 0),
      message,
      status: 'pending'
    });
    
    await borrowing.save();
    await borrowing.populate(['item', 'borrower', 'owner']);
    
    // Create notification for item owner
    await createNotification({
      recipient: item.owner._id,
      sender: req.user.id,
      type: 'borrowing_request',
      title: 'New Borrowing Request',
      message: `${req.user.name} wants to borrow your ${item.name}`,
      data: { borrowingId: borrowing._id, itemId: item._id }
    });
    
    res.status(201).json({
      message: 'Borrowing request sent successfully',
      borrowing
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating borrowing request' });
  }
});

// Approve borrowing request
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('item')
      .populate('borrower');
    
    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing request not found' });
    }
    
    if (borrowing.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    borrowing.status = 'approved';
    borrowing.approvedAt = new Date();
    await borrowing.save();
    
    // Update item availability
    await Item.findByIdAndUpdate(borrowing.item._id, {
      availability: 'borrowed'
    });
    
    // Notify borrower
    await createNotification({
      recipient: borrowing.borrower._id,
      sender: req.user.id,
      type: 'borrowing_approved',
      title: 'Request Approved!',
      message: `Your request to borrow ${borrowing.item.name} has been approved`,
      data: { borrowingId: borrowing._id }
    });
    
    res.json({ message: 'Borrowing request approved' });
  } catch (error) {
    res.status(500).json({ error: 'Error approving request' });
  }
});

// Decline borrowing request
router.put('/:id/decline', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('item')
      .populate('borrower');
    
    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing request not found' });
    }
    
    if (borrowing.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    borrowing.status = 'declined';
    borrowing.declineReason = reason;
    await borrowing.save();
    
    // Notify borrower
    await createNotification({
      recipient: borrowing.borrower._id,
      sender: req.user.id,
      type: 'borrowing_declined',
      title: 'Request Declined',
      message: `Your request to borrow ${borrowing.item.name} was declined`,
      data: { borrowingId: borrowing._id }
    });
    
    res.json({ message: 'Borrowing request declined' });
  } catch (error) {
    res.status(500).json({ error: 'Error declining request' });
  }
});

// Return item
router.put('/:id/return', auth, async (req, res) => {
  try {
    const { condition, notes } = req.body;
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('item');
    
    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing not found' });
    }
    
    if (borrowing.borrower.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    borrowing.status = 'returned';
    borrowing.returnedAt = new Date();
    borrowing.returnCondition = condition;
    borrowing.returnNotes = notes;
    await borrowing.save();
    
    // Update item availability
    await Item.findByIdAndUpdate(borrowing.item._id, {
      availability: 'available'
    });
    
    // Notify owner
    await createNotification({
      recipient: borrowing.owner,
      sender: req.user.id,
      type: 'borrowing_returned',
      title: 'Item Returned',
      message: `${req.user.name} has returned your ${borrowing.item.name}`,
      data: { borrowingId: borrowing._id }
    });
    
    res.json({ message: 'Item returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error returning item' });
  }
});

// Get borrowing by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('item')
      .populate('borrower', 'name email avatar')
      .populate('owner', 'name email avatar');
    
    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing not found' });
    }
    
    // Check if user is involved in this borrowing
    if (borrowing.borrower._id.toString() !== req.user.id && 
        borrowing.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json({ borrowing });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching borrowing' });
  }
});

module.exports = router;