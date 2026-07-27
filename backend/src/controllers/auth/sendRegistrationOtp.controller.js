import crypto from "crypto";
import User from "../../models/userModels.js";
import sendEmail from "../../utils/sendEmail.js";
import registrationOtps from "../../utils/otpStore.js";

const sendRegistrationOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const formattedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ email: formattedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    registrationOtps.set(formattedEmail, {
      hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    const sent = await sendEmail(
      formattedEmail,
      "Email Verification OTP",
      `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Email Verification</h2>
        <p>Your OTP for account registration is:</p>
        <h1 style="letter-spacing:5px; color:#4f46e5;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
      `
    );

    if (!sent) {
      registrationOtps.delete(formattedEmail);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default sendRegistrationOtp;
