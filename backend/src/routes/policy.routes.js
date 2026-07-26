import express from "express";
import {
  getPolicies,
  updatePolicies,
} from "../controllers/policy/policy.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ===========================================
   Policies
=========================================== */

// Get all policies
router.get("/", getPolicies);

// Update all policies
router.put("/", protect, isAdminOrStaff, updatePolicies);

export default router;