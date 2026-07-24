import express from "express";

import upload from "../middlewares/upload.middleware.js";
import { createStaff, deleteStaff, getAllStaff, getSingleStaff, updateStaff } from "../controllers/staff/staff.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

// import {
  
//   getAllStaff,
//   getSingleStaff,
//   updateStaff,
//   deleteStaff,
// } from "../controller/staff/staff.controller.js";

const router = express.Router();

router.post("/",protect,isAdmin, upload.single("image"), createStaff);

router.get("/",protect,isAdmin, getAllStaff);

router.get("/:id",protect,isAdmin, getSingleStaff);

router.put("/:id",protect,isAdmin, upload.single("image"), updateStaff);

router.delete("/:id", protect,isAdmin, deleteStaff);

export default router;