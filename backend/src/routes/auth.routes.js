import express from "express";
import register from "../controllers/auth/register.controller.js";
import login from "../controllers/auth/login.controller.js";
import logout from "../controllers/auth/logout.controller.js";
import forgotPassword from "../controllers/auth/forgotPassword.controller.js";
import resetPassword from "../controllers/auth/resetPassword.controller.js";
import changePassword from "../controllers/auth/changePassword.controller.js";
import googleLogin from "../controllers/auth/google.controller.js";
import getUsers from "../controllers/auth/getUsers.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/google", googleLogin);
router.get("/users", protect, getUsers);

// Returns active logged-in user profile retrieved by JWT
router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
