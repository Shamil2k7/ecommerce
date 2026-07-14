import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully on : ${connection.connection.host}`);
  } catch (error) {
    console.error(` Database connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;