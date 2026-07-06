const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const token = generateToken('new-user-id');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: 'new-user-id',
        name,
        email,
        isVerified: true,
        trustScore: 50,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Allow any email/password for demo
    if (email && password) {
      const token = generateToken('demo-user-id');
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: 'demo-user-id',
          name: email.split('@')[0],
          email: email,
          isVerified: true,
          trustScore: 50,
          role: 'user'
        }
      });
    }

    return res.status(401).json({ error: 'Please provide email and password' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;