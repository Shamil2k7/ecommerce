import Banner from "../../models/Banner.js";
import cloudinary from "../../config/cloudinary.js";

// create

export const createBanner = async (req, res) => {
  try {
    console.log("Create Banner API Called");

    const { image, displayOrder, status } = req.body;

    console.log("Request Body:", req.body);

    const result = await cloudinary.uploader.upload(image);

    console.log("Cloudinary Response:", result);

    const banner = await Banner.create({
      image: result.secure_url,
      displayOrder,
      status,
    });

    console.log("Banner Saved:", banner);

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.log("Create Banner Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// find all

export const getAllBanners = async (req, res) => {
  try {
    console.log("Get All Banners API Called");

    const banners = await Banner.find();

    console.log("Banners:", banners);

    res.status(200).json({
      banners,
    });
  } catch (error) {
    console.log("Get All Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// findById

export const getBannerById = async (req, res) => {
  try {
    console.log("Get Banner By ID API Called");
    console.log("Banner ID:", req.params.id);

    const banner = await Banner.findById(req.params.id);

    console.log("Banner:", banner);

    res.status(200).json({
      banner,
    });
  } catch (error) {
    console.log("Get By ID Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//update

export const updateBanner = async (req, res) => {
  try {
    console.log("Update Banner API Called");
    console.log("Banner ID:", req.params.id);
    console.log("Request Body:", req.body);

    const { image, displayOrder, status } = req.body;

    const banner = await Banner.findById(req.params.id);

    console.log("Old Banner:", banner);

    if (image) {
      const result = await cloudinary.uploader.upload(image);

      console.log("New Cloudinary Image:", result);

      banner.image = result.secure_url;
    }

    banner.displayOrder = displayOrder;
    banner.status = status;

    await banner.save();

    console.log("Updated Banner:", banner);

    res.status(200).json({
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete

export const deleteBanner = async (req, res) => {
  try {
    console.log("Delete Banner API Called");
    console.log("Banner ID:", req.params.id);

    await Banner.findByIdAndDelete(req.params.id);

    console.log("Banner Deleted Successfully");

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};