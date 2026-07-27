import User from "../../models/userModels.js";

const toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot block your own account",
      });
    }

    if (req.user.role === "staff" && user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default toggleBlockUser;