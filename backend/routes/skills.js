const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all skills with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      level,
      type,
      search,
      lat,
      lng,
      radius = 10,
      sortBy = 'createdAt'
    } = req.query;

    let query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Level filter
    if (level) {
      query.level = level;
    }

    // Pricing type filter
    if (type) {
      query['pricing.type'] = type;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { 'ratings.average': -1 };
        break;
      case 'price':
        sortOptions = { 'pricing.hourlyRate': 1 };
        break;
      case 'popular':
        sortOptions = { bookings: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skills = await Skill.find(query)
      .populate('provider', 'name avatar ratings location')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Skill.countDocuments(query);

    res.json({
      skills,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

// Get skill by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('provider', 'name avatar ratings location bio');

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Increment views
    skill.views += 1;
    await skill.save();

    res.json({ skill });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Error fetching skill' });
  }
});

// Create new skill
router.post('/', auth, async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      provider: req.user.id
    };

    const skill = new Skill(skillData);
    await skill.save();

    await skill.populate('provider', 'name avatar ratings');

    res.status(201).json({
      message: 'Skill created successfully',
      skill
    });

  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Error creating skill' });
  }
});

// Update skill
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      provider: req.user.id
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found or not authorized' });
    }

    Object.assign(skill, req.body);
    skill.updatedAt = Date.now();
    await skill.save();

    await skill.populate('provider', 'name avatar ratings');

    res.json({
      message: 'Skill updated successfully',
      skill
    });

  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Error updating skill' });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      provider: req.user.id
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found or not authorized' });
    }

    res.json({ message: 'Skill deleted successfully' });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Error deleting skill' });
  }
});

// Add skill review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check if user already reviewed
    const existingReview = skill.ratings.reviews.find(
      review => review.reviewer.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this skill' });
    }

    // Add review
    skill.ratings.reviews.push({
      reviewer: req.user.id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = skill.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
    skill.ratings.average = totalRating / skill.ratings.reviews.length;
    skill.ratings.count = skill.ratings.reviews.length;

    await skill.save();

    res.json({
      message: 'Review added successfully',
      skill
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Error adding review' });
  }
});

// Get skill categories
router.get('/categories/list', (req, res) => {
  const categories = [
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
  ];

  res.json({ categories });
});

// Get user's skills
router.get('/user/my-skills', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ provider: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ skills });

  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ error: 'Error fetching user skills' });
  }
});

module.exports = router;