import express from "express";
import {
  getPolicies,
  updatePolicies,
} from "../controllers/policy/policy.controller.js";

const router = express.Router();

/* ===========================================
   Policies
=========================================== */

// Get all policies
router.get("/", getPolicies);

// Update all policies
router.put("/", updatePolicies);

export default router;