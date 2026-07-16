// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import userRoutes from "./routes/userRoutes.js";


// dotenv.config({ override: true });
// console.log("Using MONGO_URI:", process.env.MONGO_URI);

// const port = process.env.PORT || 5000;
// const app = express();

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/api/users', userRoutes);




// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//  console.log("Connected to MongoDB");
//   } catch (error) {
//     console.log("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }


// };
// connectDB();


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });