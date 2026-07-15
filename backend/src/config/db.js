import mongoose from "mongoose";
import dns from "dns";

// Bypass local gateway DNS proxies that fail to resolve SRV records (e.g. mobile hotspots)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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