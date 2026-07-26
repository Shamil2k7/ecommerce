import User from "../../models/userModels.js";
import createToken from "../../utils/generateToken.js";

const register = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields (Full Name, Email, Phone, Password)",
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

    const userExists = await User.findOne({
      $or: [{ email: formattedEmail }, { phone: formattedPhone }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone number already exists",
      });
    }

    const user = await User.create({
      fullName: formattedName,
      email: formattedEmail,
      phone: formattedPhone,
      password,
    });

    if (user) {
      createToken(res, user._id);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
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
      message: error.message,
    });
  }
};

export default register;

