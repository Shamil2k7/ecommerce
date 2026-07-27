import User from "../../models/userModels.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "_id fullName email phone role profileImage department address status isVerified isBlocked createdAt updatedAt"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default getUsers;