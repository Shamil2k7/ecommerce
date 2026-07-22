import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./src/config/cloudinary.js";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import couponRoutes from "./src/routes/marketing.routes.js";
import heroSectionRoutes from "./src/routes/heroSection.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import policyRoutes from "./src/routes/policy.routes.js";
const app = express();

// Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Increase request size limit (Fixes PayloadTooLargeError)
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/marketing", couponRoutes);
app.use("/api/marketing/hero-sections", heroSectionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/policies", policyRoutes);
// Home Route
app.get("/", (req, res) => {
  res.send("A simple Node App is running on this server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});