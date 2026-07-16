import bcrypt from "bcrypt";

import cloudinary from "../../config/cloudinary.js";
import Staff from "../../models/Staff.js";


// ===============================
// CREATE STAFF
// ===============================
export const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      department,
      address,
      status,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await Staff.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      department,
      address,
      status,
      image: req.file?.path || "",
      cloudinary_id: req.file?.filename || "",
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL STAFF
// ===============================
export const getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.find().select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: staffs.length,
      data: staffs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE STAFF
// ===============================
export const getSingleStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE STAFF
// ===============================
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const {
      name,
      email,
      phone,
      password,
      role,
      department,
      address,
      status,
    } = req.body;

    if (email && email !== staff.email) {
      const emailExists = await Staff.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    let hashedPassword = staff.password;

    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let image = staff.image;
    let cloudinary_id = staff.cloudinary_id;

    if (req.file) {
      if (staff.cloudinary_id) {
        await cloudinary.uploader.destroy(staff.cloudinary_id);
      }

      image = req.file.path;
      cloudinary_id = req.file.filename;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        department,
        address,
        status,
        image,
        cloudinary_id,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE STAFF
// ===============================
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.cloudinary_id) {
      await cloudinary.uploader.destroy(staff.cloudinary_id);
    }

    await Staff.findByIdAndDelete(req.params.id);

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