import HeroSection from "../../models/HeroSection.js";
import cloudinary from "../../config/cloudinary.js";

// Create Hero Section
export const createHeroSection = async (req, res) => {
  try {
    const {
      brand,
      offer,
      subOffer,
      image,
      displayOrder,
      status,
    } = req.body;

    const result = await cloudinary.uploader.upload(image);

    const hero = await HeroSection.create({
      brand,
      offer,
      subOffer,
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

    res.json({
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

// Get Hero Section By ID
export const getHeroSectionById = async (req, res) => {
  try {
    const hero = await HeroSection.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero Section not found",
      });
    }

    res.json({
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

    if (req.body.image && req.body.image.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(req.body.image);

      image = result.secure_url;
    }

    hero.brand = req.body.brand;
    hero.offer = req.body.offer;
    hero.subOffer = req.body.subOffer;
    hero.image = image;
    hero.displayOrder = req.body.displayOrder;
    hero.status = req.body.status;

    await hero.save();

    res.json({
      success: true,
      message: "Hero Section Updated",
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

    res.json({
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