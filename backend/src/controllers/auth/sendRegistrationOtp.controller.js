import crypto from "crypto";
import User from "../../models/userModels.js";
import sendEmail from "../../utils/sendEmail.js";
import Otp from "../../models/otpModel.js";

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
    const userExists = await User.findOne({ email: formattedEmail });

    if (userExists) {
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

    await Otp.findOneAndUpdate(
      { email: formattedEmail },
      {
        hashedOtp,
        isVerified: false,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const emailSent = await sendEmail(
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

    if (!emailSent) {
      await Otp.deleteOne({ email: formattedEmail });

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default sendRegistrationOtp;