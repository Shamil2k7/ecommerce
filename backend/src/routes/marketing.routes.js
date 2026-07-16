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

const router = express.Router();

//coupon routes

router.post("/coupons", createCoupon);
router.get("/coupons", getCoupons);
router.get("/coupons/:id", getCouponById);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

//banner routes

router.post("/banners", createBanner);
router.get("/banners", getAllBanners);
router.get("/banners/:id", getBannerById);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

export default router;