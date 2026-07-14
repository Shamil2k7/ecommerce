import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./src/config/db.js";

// Creating express object
const app = express();
connectDB();

// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
  res.end();
});

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
