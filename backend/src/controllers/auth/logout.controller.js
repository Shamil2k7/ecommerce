const logout = async (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default logout;
