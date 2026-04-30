const mongoose = require('mongoose');
const seedData = require('../utils/seedData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Force IPv4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedData(); // Seed data for live db
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    console.log("Attempting to start local in-memory database as fallback...");
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB In-Memory Server Connected: ${conn.connection.host}`);
      await seedData(); // Seed data for in-memory db
    } catch (fallbackError) {
      console.error(`Error starting fallback in-memory database: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
