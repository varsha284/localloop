const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, bio, location } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        phone, 
        bio,
        location: location ? { address: location.address } : undefined
      },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Add user rating
router.post('/:id/rating', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user already rated
    const existingRating = user.ratings.reviews.find(
      review => review.reviewer.toString() === req.user.id
    );
    
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this user' });
    }
    
    // Add new rating
    user.ratings.reviews.push({
      reviewer: req.user.id,
      rating,
      comment
    });
    
    // Update average rating
    user.updateRating(rating);
    await user.save();
    
    res.json({ message: 'Rating added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding rating' });
  }
});

module.exports = router;