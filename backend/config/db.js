const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For now, use a local MongoDB URI
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/localloop');
    // Removed the options - newer mongoose doesn't need them
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Don't exit process for now, just show error
    console.log('⚠️  Continuing without database connection for development');
  }
};

module.exports = connectDB;