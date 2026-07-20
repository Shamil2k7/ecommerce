import crypto from "crypto";
import User from "../../models/userModels.js";
import sendEmail from "../../utils/sendEmail.js";

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide an email address" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetURL = `${frontendUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetURL}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block; margin: 15px 0;">
            Reset Password
          </a>
          <p>This link expires in 15 minutes.</p>
        </div>
      `
    );

    res.json({
      success: true,
      message: "Password reset email sent",
      token: process.env.NODE_ENV === "development" ? token : undefined,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default forgotPassword;
