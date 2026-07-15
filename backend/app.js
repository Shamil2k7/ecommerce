import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import cors from "cors";

// Creating express object
const app = express();

//CORS
app.use(cors({origin:process.env.FRONTEND_URL, 
  credentials:true})
);

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
});
// app.use('/api/order',orderRouter)

const PORT = process.env.PORT || 5000;
// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
