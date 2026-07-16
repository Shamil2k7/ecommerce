import express from "express";
import { getSettings, updateSettings, uploadFavicon, uploadLogo } from "../controllers/settings/settingsController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Get settings
router.get("/", getSettings);

// Update store name & tagline
router.put("/", updateSettings);

// Upload logo
router.put("/logo", upload.single("logo"), uploadLogo);

// Upload favicon
router.put("/favicon", upload.single("favicon"), uploadFavicon);

export default router;