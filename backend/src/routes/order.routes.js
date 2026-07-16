import express from "express";
import { createOrder } from "../controllers/order/order.controller.js";




const router = express.Router();

// Create Order
router.post("/create",createOrder );

export default router;