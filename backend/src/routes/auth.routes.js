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
import protect from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

import { getProfile, updateProfile } from "../controllers/auth/profile.controller.js";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/auth/address.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/google", googleLogin);
router.get("/users", protect, isAdmin, getUsers);
router.patch("/users/:id/block", protect, isAdmin, toggleBlockUser);

// Get the logged-in user's profile from the JWT cookie
router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Profile Management
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Address Management
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

export default router;
