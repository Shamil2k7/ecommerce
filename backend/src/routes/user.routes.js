import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/userController.js";
import protect from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getCurrentUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;