import crypto from "crypto";
import User from "../../models/userModels.js";
import createToken from "../../utils/generateToken.js";

const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google token is required",
    });
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Failed to verify Google token",
      });
    }

    const { email, name, sub, email_verified } = await response.json();

    if (!email_verified || !email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked",
        });
      }

      createToken(res, user._id);

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
        },
      });
    }

    const phone = `G-${sub.slice(-10)}`;

    const phoneExists = await User.findOne({ phone });

    const finalPhone = phoneExists
      ? `${phone}-${Date.now().toString().slice(-4)}`
      : phone;

    user = await User.create({
      fullName: name || "Google User",
      email,
      phone: finalPhone,
      password: crypto.randomBytes(16).toString("hex"),
      isVerified: true,
    });

    createToken(res, user._id);

    res.status(201).json({
      success: true,
      message: "Google registration successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default googleLogin;