import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./src/config/db.js";
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

// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
  res.end();
});
// app.use('/api/order',orderRouter)

const PORT = process.env.PORT || 5000;
// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
