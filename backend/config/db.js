const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/brixo";
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log("Database fallback mode activated: APIs will run using local JSON file storage.");
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected
};
