import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env from root folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cinema_booking";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connection test successful!");
    console.log(`Connected to: ${mongoUri}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

testConnection();