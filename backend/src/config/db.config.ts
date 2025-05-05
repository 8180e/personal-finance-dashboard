import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, disconnectDB };
