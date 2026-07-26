import express from "express";

import {
  createHeroSection,
  getHeroSections,
  getActiveHeroSections,
  getHeroSectionById,
  updateHeroSection,
  deleteHeroSection,
} from "../controllers/marketing/heroSection.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, isAdminOrStaff, createHeroSection);
router.get("/", getHeroSections);
router.get("/active", getActiveHeroSections);
router.get("/:id", getHeroSectionById);
router.put("/:id", protect, isAdminOrStaff, updateHeroSection);
router.delete("/:id", protect, isAdminOrStaff, deleteHeroSection);

export default router;