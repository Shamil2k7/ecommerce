import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { addToWishlist, checkWishlist, getWishlist, removeWishlist } from "../controllers/wishlist/wishlist.controller.js";



const router = express.Router();

router.get("/", protect, getWishlist);

router.post("/:productId", protect, addToWishlist);

router.delete("/:productId", protect, removeWishlist);

router.get("/check/:productId", protect, checkWishlist);

export default router;