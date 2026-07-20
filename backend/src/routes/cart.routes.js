import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
} from "../controllers/user/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/remove/:userId/:productId", removeItem);
router.delete("/clear/:userId", clearCart);
router.post("/apply-coupon", applyCoupon);

export default router;
