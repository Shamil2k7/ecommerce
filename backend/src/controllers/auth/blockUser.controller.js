import User from "../../models/userModels.js";

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    if (req.user.role === "staff" && user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to block this user",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default toggleBlockUser;