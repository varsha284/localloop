const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all groups
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      privacy = 'public',
      search,
      lat,
      lng,
      radius = 10
    } = req.query;

    let query = { isActive: true };

    // Privacy filter
    if (privacy !== 'all') {
      query.privacy = privacy;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location filter
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000
        }
      };
    }

    const groups = await Group.find(query)
      .populate('creator', 'name avatar')
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Group.countDocuments(query);

    res.json({
      groups,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Error fetching groups' });
  }
});

// Get group by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name avatar bio')
      .populate('members.user', 'name avatar ratings');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user has access to private group
    if (group.privacy === 'private' && req.user) {
      const isMember = group.members.some(
        member => member.user._id.toString() === req.user.id
      );
      if (!isMember && group.creator._id.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied to private group' });
      }
    }

    res.json({ group });

  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Error fetching group' });
  }
});

// Create new group
router.post('/', auth, async (req, res) => {
  try {
    const groupData = {
      ...req.body,
      creator: req.user.id,
      members: [{
        user: req.user.id,
        role: 'admin',
        joinedAt: new Date()
      }]
    };

    const group = new Group(groupData);
    await group.save();

    await group.populate('creator', 'name avatar');
    await group.populate('members.user', 'name avatar');

    res.status(201).json({
      message: 'Group created successfully',
      group
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Error creating group' });
  }
});

// Update group
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is admin
    const userMember = group.members.find(
      member => member.user.toString() === req.user.id
    );

    if (!userMember || (userMember.role !== 'admin' && group.creator.toString() !== req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to update group' });
    }

    Object.assign(group, req.body);
    await group.save();

    await group.populate('creator', 'name avatar');
    await group.populate('members.user', 'name avatar');

    res.json({
      message: 'Group updated successfully',
      group
    });

  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Error updating group' });
  }
});

// Join group
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if already a member
    const existingMember = group.members.find(
      member => member.user.toString() === req.user.id
    );

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    // Check group capacity
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ error: 'Group is at maximum capacity' });
    }

    // Add member
    group.members.push({
      user: req.user.id,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();

    res.json({ message: 'Successfully joined group' });

  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Error joining group' });
  }
});

// Leave group
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      member => member.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
      return res.status(400).json({ error: 'Not a member of this group' });
    }

    // Creator cannot leave (must transfer ownership first)
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({ error: 'Group creator cannot leave. Transfer ownership first.' });
    }

    // Remove member
    group.members.splice(memberIndex, 1);
    await group.save();

    res.json({ message: 'Successfully left group' });

  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: 'Error leaving group' });
  }
});

// Update member role
router.put('/:id/members/:memberId/role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is admin
    const userMember = group.members.find(
      member => member.user.toString() === req.user.id
    );

    if (!userMember || (userMember.role !== 'admin' && group.creator.toString() !== req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to update member roles' });
    }

    // Find and update member
    const memberToUpdate = group.members.find(
      member => member.user.toString() === req.params.memberId
    );

    if (!memberToUpdate) {
      return res.status(404).json({ error: 'Member not found' });
    }

    memberToUpdate.role = role;
    await group.save();

    res.json({ message: 'Member role updated successfully' });

  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ error: 'Error updating member role' });
  }
});

// Get user's groups
router.get('/user/my-groups', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { creator: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
      .populate('creator', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ groups });

  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ error: 'Error fetching user groups' });
  }
});

// Get group types
router.get('/types/list', (req, res) => {
  const types = [
    'buying',
    'sharing',
    'skill_exchange',
    'neighborhood',
    'interest'
  ];

  res.json({ types });
});

module.exports = router;