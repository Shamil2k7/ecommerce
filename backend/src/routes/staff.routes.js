import express from "express";

import upload from "../middlewares/upload.middleware.js";
import { createStaff, deleteStaff, getAllStaff, getSingleStaff, updateStaff } from "../controllers/staff/staff.controller.js";

// import {
  
//   getAllStaff,
//   getSingleStaff,
//   updateStaff,
//   deleteStaff,
// } from "../controller/staff/staff.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createStaff);

router.get("/", getAllStaff);

router.get("/:id", getSingleStaff);

router.put("/:id", upload.single("image"), updateStaff);

router.delete("/:id", deleteStaff);

export default router;