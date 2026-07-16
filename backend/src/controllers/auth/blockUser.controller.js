import User from "../../models/userModels.js";

// Block or unblock a user
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
