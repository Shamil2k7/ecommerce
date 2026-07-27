
import cloudinary from "../../config/cloudinary.js";
import User from "../../models/userModels.js";

//create all staffs
export const createStaff = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      department,
      address,
      status,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }



    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "staff",
      department,
      address,
      status,
      profileImage: req.file?.path || "",
      cloudinary_id: req.file?.filename || "",
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all staff
export const getAllStaff = async (req, res) => {
  try {
    const users = await User.find({ role: "staff" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//single staff get
export const getSingleStaff = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "staff",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update staffs
export const updateStaff = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "staff",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const {
      fullName,
      email,
      phone,
      password,
      department,
      address,
      status,
    } = req.body;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }




    let profileImage = user.profileImage;
    let cloudinary_id = user.cloudinary_id;

    if (req.file) {
      if (user.cloudinary_id) {
        await cloudinary.uploader.destroy(user.cloudinary_id);
      }

      profileImage = req.file.path;
      cloudinary_id = req.file.filename;
    }


    user.fullName = fullName;
    user.email = email;
    user.phone = phone;
    user.department = department;
    user.address = address;
    user.status = status;
    user.profileImage = profileImage;
    user.cloudinary_id = cloudinary_id;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete staffs
export const deleteStaff = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "staff",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found in the database",
      });
    }

    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};