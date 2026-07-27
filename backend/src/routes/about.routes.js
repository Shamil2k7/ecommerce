import express from "express";

import {
  getAbout,
  updateAbout,
  addFeature,
  deleteFeature,
  addStat,
  deleteStat,
  addTeam,
  deleteTeam,
} from "../controllers/about/about.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ==========================================
                PUBLIC ROUTES
========================================== */

// Get About Page
// GET /api/about
router.get("/", getAbout);

/* ==========================================
                ADMIN ROUTES
========================================== */

// Update About Page
// PUT /api/about
router.put("/", protect, isAdminOrStaff, updateAbout);

/* ==========================================
                FEATURES
========================================== */

// Add Feature
// POST /api/about/feature
router.post(
  "/feature",
  protect,
  isAdminOrStaff,
  addFeature
);

// Delete Feature
// DELETE /api/about/feature/:index
router.delete(
  "/feature/:index",
  protect,
  isAdminOrStaff,
  deleteFeature
);

/* ==========================================
                STATISTICS
========================================== */

// Add Statistic
// POST /api/about/stat
router.post(
  "/stat",
  protect,
  isAdminOrStaff,
  addStat
);

// Delete Statistic
// DELETE /api/about/stat/:index
router.delete(
  "/stat/:index",
  protect,
  isAdminOrStaff,
  deleteStat
);

/* ==========================================
                TEAM
========================================== */

// Add Team Member
// POST /api/about/team
router.post(
  "/team",
  protect,
  isAdminOrStaff,
  addTeam
);

// Delete Team Member
// DELETE /api/about/team/:index
router.delete(
  "/team/:index",
  protect,
  isAdminOrStaff,
  deleteTeam
);

export default router;