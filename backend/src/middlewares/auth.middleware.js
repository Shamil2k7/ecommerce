import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.userId).select("-password");
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export default protect;