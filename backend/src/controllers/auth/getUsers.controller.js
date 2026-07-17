import User from "../../models/userModels.js";

// Get all users (admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // exclude password field
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching users",
    });
  }
};

export default getUsers;
