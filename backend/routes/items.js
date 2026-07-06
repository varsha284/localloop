const express = require('express');
const router = express.Router();

// Mock items data
const mockItems = [
  {
    id: '1',
    name: 'Power Drill',
    description: 'Professional grade power drill, perfect for home projects',
    category: 'tools',
    pricing: { dailyRate: 15 },
    location: { address: 'Downtown' },
    owner: { name: 'John Doe' },
    available: true
  },
  {
    id: '2',
    name: 'Camping Tent',
    description: '4-person camping tent, waterproof and easy to set up',
    category: 'sports',
    pricing: { dailyRate: 25 },
    location: { address: 'Uptown' },
    owner: { name: 'Jane Smith' },
    available: true
  },
  {
    id: '3',
    name: 'Stand Mixer',
    description: 'KitchenAid stand mixer, great for baking enthusiasts',
    category: 'kitchen',
    pricing: { dailyRate: 20 },
    location: { address: 'Midtown' },
    owner: { name: 'Bob Wilson' },
    available: true
  }
];

// Get all items
router.get('/', (req, res) => {
  res.json({
    success: true,
    items: mockItems,
    total: mockItems.length
  });
});

// Get item by ID
router.get('/:id', (req, res) => {
  const item = mockItems.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ success: true, item });
});

module.exports = router;