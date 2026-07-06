const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localloop');
    
    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
      isVerified: true,
      location: { address: 'Test City' }
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: test@test.com');
    console.log('Password: 123456');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createTestUser();