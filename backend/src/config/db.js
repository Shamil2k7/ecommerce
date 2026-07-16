import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected ${connection.connection.host}`);
  } catch (error) {
    console.error(` Database connection Error: ${error.message}`);
  }
};

export default connectDB;
