import crypto from "crypto";
import User from "../../models/userModels.js";

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const formattedEmail = email.trim().toLowerCase();
    const formattedOtp = otp.toString().trim();

    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(formattedOtp)
      .digest("hex");

    if (user.resetPasswordToken !== hashedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (!user.resetPasswordExpire || Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      otp: formattedOtp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyOtp;