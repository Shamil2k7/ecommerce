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
    // Verify token with Google
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!googleResponse.ok) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify Google account",
      });
    }

    const googleUser = await googleResponse.json();

    const email = googleUser.email;
    const fullName = googleUser.name;
    const googleId = googleUser.sub;
    const isVerified = googleUser.email_verified;

    if (!email || !isVerified) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    // Check if user already exists
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
        message: "Login successful",
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

    // Create a phone value for Google users
    let uniquePhone = `G-${googleId.slice(-10)}`;

    const phoneExists = await User.findOne({ phone: uniquePhone });

    if (phoneExists) {
      uniquePhone = `${uniquePhone}-${Date.now().toString().slice(-4)}`;
    }

    user = await User.create({
      fullName: fullName || "Google User",
      email,
      phone: uniquePhone,
      password: crypto.randomBytes(16).toString("hex"),
      isVerified: true,
    });

    createToken(res, user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default googleLogin;