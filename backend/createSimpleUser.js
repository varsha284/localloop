const mongoose = require('mongoose');
require('dotenv').config();

const createUser = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/localloop');
    
    const userCollection = mongoose.connection.db.collection('users');
    
    // Delete existing test user
    await userCollection.deleteOne({ email: 'test@test.com' });
    
    // Create simple test user
    await userCollection.insertOne({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
      isVerified: true,
      trustScore: 50,
      role: 'user',
      createdAt: new Date(),
      lastActive: new Date()
    });
    
    console.log('Test user created: test@test.com / 123456');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUser();