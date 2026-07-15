const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const couponRoutes = require("./src/routes/marketing.routes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  res.send("A simple Node App is running on this server");
});

// Coupon Routes
app.use("/api/marketing/coupons", couponRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});