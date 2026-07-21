import express from "express";

import {
  createHeroSection,
  getHeroSections,
  getActiveHeroSections,
  getHeroSectionById,
  updateHeroSection,
  deleteHeroSection,
} from "../controllers/marketing/heroSection.controller.js";

const router = express.Router();

router.post("/", createHeroSection);
router.get("/", getHeroSections);
router.get("/active", getActiveHeroSections);
router.get("/:id", getHeroSectionById);
router.put("/:id", updateHeroSection);
router.delete("/:id", deleteHeroSection);

export default router;