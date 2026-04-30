const mongoose = require('mongoose');
const seedData = require('../utils/seedData');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is missing from environment variables!');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, 
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds before failing
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedData(); 
  } catch (error) {
    console.error('❌ CRITICAL: MongoDB Atlas Connection Failed!');
    console.error('Reason:', error.message);
    // Don't exit here, let the app stay alive so we can see the logs
  }
};

module.exports = connectDB;
