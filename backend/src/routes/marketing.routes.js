import express from "express";

// Coupon Controllers
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/marketing/coupon.controller.js";

// Banner Controllers
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/marketing/banner.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

//coupon routes

router.post("/coupons", protect, isAdminOrStaff, createCoupon);
router.get("/coupons", getCoupons);
router.get("/coupons/:id", getCouponById);
router.put("/coupons/:id", protect, isAdminOrStaff, updateCoupon);
router.delete("/coupons/:id", protect, isAdminOrStaff, deleteCoupon);

//banner routes

router.post("/banners", protect, isAdminOrStaff, createBanner);
router.get("/banners", getAllBanners);
router.get("/banners/:id", getBannerById);
router.put("/banners/:id", protect, isAdminOrStaff, updateBanner);
router.delete("/banners/:id", protect, isAdminOrStaff, deleteBanner);

export default router;