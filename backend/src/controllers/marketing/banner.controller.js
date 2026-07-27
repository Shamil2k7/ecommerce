import Banner from "../../models/Banner.js";
import cloudinary from "../../config/cloudinary.js";

// create
export const createBanner = async (req, res) => {
  try {


    const { image, displayOrder, status } = req.body;
    const result = await cloudinary.uploader.upload(image);
    const banner = await Banner.create({
      image: result.secure_url,
      displayOrder,
      status,
    });
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
    const banners = await Banner.find();

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
    const banner = await Banner.findById(req.params.id);


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

    const { image, displayOrder, status } = req.body;

    const banner = await Banner.findById(req.params.id);
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      banner.image = result.secure_url;
    }

    banner.displayOrder = displayOrder;
    banner.status = status;

    await banner.save();

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