const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for current user
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Send message
router.post('/', async (req, res) => {
  try {
    const { receiver, content } = req.body;
    
    const message = new Message({
      sender: req.user.id,
      receiver,
      content
    });
    
    const savedMessage = await message.save();
    await savedMessage.populate('sender', 'name');
    await savedMessage.populate('receiver', 'name');
    
    res.status(201).json({
      message: 'Message sent successfully',
      message: savedMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the receiver
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    
    message.isRead = true;
    await message.save();
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
});

module.exports = router;
