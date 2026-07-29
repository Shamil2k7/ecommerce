import crypto from "crypto";
import User from "../../models/userModels.js";
import Otp from "../../models/otpModel.js";

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const formattedEmail = email.trim().toLowerCase();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString().trim())
    .digest("hex");

  try {
    // Check password reset OTP
    const user = await User.findOne({ email: formattedEmail });

    if (user) {
      if (user.resetPasswordToken !== hashedOtp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    // Check registration OTP
    const otpData = await Otp.findOne({ email: formattedEmail });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (otpData.hashedOtp !== hashedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpData.isVerified = true;
    await otpData.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyOtp;