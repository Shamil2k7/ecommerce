import User from "../../models/userModels.js";
import createToken from "../../utils/generateToken.js";
import crypto from "crypto";

const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google OAuth credential token is required",
    });
  }

  try {
    const verificationResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!verificationResponse.ok) {
      return res.status(400).json({
        success: false,
        message: "Failed to verify Google credential with Google servers",
      });
    }

    const payload = await verificationResponse.json();
    const { email, name, sub, email_verified } = payload;

    if (!email_verified || !email) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified or available",
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
        message: "Google Login successful",
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
    } else {
      const generatedPhone = `G-${sub.slice(-10)}`;

      // If a Google sub ID collision happens, append a timestamp to make it unique
      const phoneExists = await User.findOne({ phone: generatedPhone });
      const finalPhone = phoneExists ? `G-${sub.slice(-10)}-${Date.now().toString().slice(-4)}` : generatedPhone;

      const generatedPassword = crypto.randomBytes(16).toString("hex");

      user = await User.create({
        fullName: name || "Google User",
        email,
        phone: finalPhone,
        password: generatedPassword,
        isVerified: true,
      });

      createToken(res, user._id);

      return res.status(201).json({
        success: true,
        message: "Google Registration successful",
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during Google OAuth",
    });
  }
};

export default googleLogin;
