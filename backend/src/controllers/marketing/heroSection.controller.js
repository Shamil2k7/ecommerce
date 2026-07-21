import HeroSection from "../../models/HeroSection.js";
import cloudinary from "../../config/cloudinary.js";

// Create Hero Section
export const createHeroSection = async (req, res) => {
  try {
    const {
      brand,
      image,
      displayOrder,
      status,
    } = req.body;

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required",
      });
    }

    const result = await cloudinary.uploader.upload(image);

    const hero = await HeroSection.create({
      brand,
      image: result.secure_url,
      displayOrder,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Hero Section Created Successfully",
      hero,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Hero Sections
export const getHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find().sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      heroSections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Active Hero Sections
export const getActiveHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find({
      status: "Active",
    }).sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      heroSections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Hero By ID
export const getHeroSectionById = async (req, res) => {
  try {
    const hero = await HeroSection.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero Section not found",
      });
    }

    res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Hero Section
export const updateHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero Section not found",
      });
    }

    let image = hero.image;

    if (
      req.body.image &&
      req.body.image.startsWith("data:image")
    ) {
      const result = await cloudinary.uploader.upload(
        req.body.image
      );

      image = result.secure_url;
    }

    hero.brand = req.body.brand;
    hero.image = image;
    hero.displayOrder = req.body.displayOrder;
    hero.status = req.body.status;

    await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero Section Updated Successfully",
      hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Hero Section
export const deleteHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero Section not found",
      });
    }

    await hero.deleteOne();

    res.status(200).json({
      success: true,
      message: "Hero Section Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};