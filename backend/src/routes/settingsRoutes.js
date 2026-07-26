import express from "express";
import {
  getSettings,
  updateSettings,
  uploadLogo,
  uploadFavicon,
  removeLogo,
  removeFavicon,
} from "../controllers/settings/settingsController.js";
import upload from "../config/multer.js";
import protect from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get settings
router.get("/", getSettings);

// Update store name & tagline
router.put("/", protect, isAdmin, updateSettings);

// Upload logo
router.put("/logo", protect, isAdmin, upload.single("logo"), uploadLogo);

// Upload favicon
router.put("/favicon", protect, isAdmin, upload.single("favicon"), uploadFavicon);

router.delete("/logo", protect, isAdmin, removeLogo);
router.delete("/favicon", protect, isAdmin, removeFavicon);

export default router;