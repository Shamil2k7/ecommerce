import Wishlist from "../../models/wishlist.model.js";
import Product from "../../models/product.model.js";

// ===========================================
// Add to Wishlist
// POST /api/wishlist/:productId
// ===========================================

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check already exists
    const exists = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Get Wishlist
// GET /api/wishlist
// ===========================================

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    })
      .populate({
        path: "product",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "brand",
            select: "name",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Remove Wishlist
// DELETE /api/wishlist/:productId
// ===========================================

export const removeWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Check Wishlist
// GET /api/wishlist/check/:productId
// ===========================================

export const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    res.status(200).json({
      success: true,
      wishlisted: !!wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Toggle Wishlist
// POST /api/wishlist/toggle/:productId
// ===========================================

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const exists = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) {
      await exists.deleteOne();

      return res.status(200).json({
        success: true,
        wishlisted: false,
        message: "Removed from wishlist",
      });
    }

    await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      wishlisted: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};