import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cloudinary from "./src/config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import couponRoutes from "./src/routes/marketing.routes.js"
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import cartRoutes from "./src/routes/cart.routes.js";

const app = express();

//CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
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
app.use("/api/marketing", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", productRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/cart", cartRoutes);
// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
});




const PORT = process.env.PORT || 5000;
// Server Setup
app.listen(PORT, console.log(`Server started on port http://localhost:  ${PORT}`));
