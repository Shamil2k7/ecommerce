import crypto from "crypto";
import User from "../../models/userModels.js";
import sendEmail from "../../utils/sendEmail.js";

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide an email address" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    // Generate plain-text reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Store secure hashed version of the token and set expiration (1 hour)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save({ validateBeforeSave: false });

    // Client Link to Reset Password
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    const message = `Please click on the link to reset your password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "ShopAura - Password Reset Request",
        message,
        html: `
          <h3>Reset Your Password</h3>
          <p>Click on the link below to choose a new password. The link is valid for 1 hour.</p>
          <a href="${resetUrl}" target="_blank">Reset Password Link</a>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        token: process.env.NODE_ENV === "development" ? resetToken : undefined,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: "Could not send email: " + error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default forgotPassword;
