import express from "express";

import {
  addToWishlist,
  removeWishlist,
  getWishlist,
  checkWishlist,
  toggleWishlist,
} from "../controllers/wishlist/wishlist.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/", protect, getWishlist);

router.get("/check/:productId", protect, checkWishlist);

router.post("/toggle/:productId", protect, toggleWishlist);

router.post("/:productId", protect, addToWishlist);

router.delete("/:productId", protect, removeWishlist);




// Add this route

export default router;