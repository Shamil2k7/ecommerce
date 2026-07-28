// controllers/product/review.controller.js

import Product from "../../models/product.model.js";

export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("reviews.user", "name email")
      .select("name images reviews");

    const reviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        reviews.push({
          id: review._id,
          productId: product._id,
          productName: product.name,
          productImage:
            product.images?.find((i) => i.isPrimary)?.url ||
            product.images?.[0]?.url ||
            "/images/no-image.png",

          customer: review.user?.name || "Unknown",
          email: review.user?.email || "",

          rating: review.rating,
          review: review.comment,

          date: review.createdAt,

          status: "Published",
        });
      });
    });

    reviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};