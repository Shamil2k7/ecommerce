import crypto from "crypto";
import User from "../../models/userModels.js";

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

// Hash OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (user.resetPasswordToken !== hashedOtp) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    // Check expiry
    if (Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ success: false, message: "Verification code has expired" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: otp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default verifyOtp;
