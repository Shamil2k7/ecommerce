import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import couponRoutes from "./src/routes/marketing.routes.js"
import orderRoutes from "./src/routes/order.routes.js";
import productRoutes from "./src/routes/product.routes.js";

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
app.use("/api/marketing/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
// Handling GET request
app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
});
// app.use('/api/order',orderRouter)

const PORT = process.env.PORT || 5000;
// Server Setup
app.listen(PORT, console.log(`Server started on port http://localhost:  ${PORT}`));
