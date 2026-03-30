import mongoose from "mongoose";

const testConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/popcorn_cinema");
    console.log("MongoDB connection test successful!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

testConnection();