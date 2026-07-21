import express from "express";

import {
  createHeroSection,
  getHeroSections,
  getHeroSectionById,
  updateHeroSection,
  deleteHeroSection,
} from "../controllers/marketing/heroSection.controller.js";

const router = express.Router();

router.post("/", createHeroSection);

router.get("/", getHeroSections);

router.get("/:id", getHeroSectionById);

router.put("/:id", updateHeroSection);

router.delete("/:id", deleteHeroSection);

export default router;