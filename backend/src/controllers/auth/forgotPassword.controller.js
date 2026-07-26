import crypto from "crypto";
import User from "../../models/userModels.js";
import sendEmail from "../../utils/sendEmail.js";

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const sent = await sendEmail(
      user.email,
      "Password Reset OTP",
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="text-align: center; color: #4f46e5; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
      `
    );

    if (!sent) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default forgotPassword;