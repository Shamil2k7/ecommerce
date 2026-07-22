import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
} from "../controllers/user/cart.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.delete("/remove/:userId/:productId", protect, removeItem);
router.delete("/clear/:userId", protect, clearCart);
router.post("/apply-coupon", protect, applyCoupon);

export default router;
