import User from "../../models/userModels.js";
import createToken from "../../utils/generateToken.js";

const register = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const formattedEmail = email.trim().toLowerCase();
    const formattedPhone = phone.trim();
    const formattedName = fullName.trim();

    const existingUser = await User.findOne({
      $or: [
        { email: formattedEmail },
        { phone: formattedPhone },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName: formattedName,
      email: formattedEmail,
      phone: formattedPhone,
      password,
    });

    createToken(res, user._id);

    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default register;