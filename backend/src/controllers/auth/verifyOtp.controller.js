import crypto from "crypto";
import User from "../../models/userModels.js";
import registrationOtps from "../../utils/otpStore.js";

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
    const user = await User.findOne({
      email: formattedEmail,
    });

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

    const record = registrationOtps.get(formattedEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (record.expiresAt < Date.now()) {
      registrationOtps.delete(formattedEmail);
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (record.hashedOtp !== hashedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    record.isVerified = true;

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyOtp;