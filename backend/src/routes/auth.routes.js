import express from "express";

import register from "../controllers/auth/register.controller.js";
import login from "../controllers/auth/login.controller.js";
import logout from "../controllers/auth/logout.controller.js";
import forgotPassword from "../controllers/auth/forgotPassword.controller.js";
import verifyOtp from "../controllers/auth/verifyOtp.controller.js";
import resetPassword from "../controllers/auth/resetPassword.controller.js";
import changePassword from "../controllers/auth/changePassword.controller.js";
import googleLogin from "../controllers/auth/google.controller.js";
import getUsers from "../controllers/auth/getUsers.controller.js";
import toggleBlockUser from "../controllers/auth/blockUser.controller.js";
import { getProfile, updateProfile } from "../controllers/auth/profile.controller.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth/address.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

// Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

// User
router.post("/change-password", protect, changePassword);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Address
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

// Admin / Staff
router.get("/users", protect, isAdminOrStaff, getUsers);
router.patch("/users/:id/block", protect, isAdminOrStaff, toggleBlockUser);

export default router;