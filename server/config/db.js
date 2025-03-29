const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" }); // Load environment variables

const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectToMongoose = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    // Successful Connection
    console.log("✅ Connected to MongoDB");

    // Connection Events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
                                
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the app on connection failure
  }
};

module.exports = connectToMongoose;
