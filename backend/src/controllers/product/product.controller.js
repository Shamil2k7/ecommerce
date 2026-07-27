import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import Brand from "../../models/brand.model.js";
import cloudinary from "../../config/cloudinary.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Order from "../../models/Order.js";

// @desc Create Product
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, price, stock } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Product name is required");
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, "Description is required");
  }
  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  if (brand) {
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      throw new ApiError(404, "Brand not found");
    }
  }

  const images =
    req.files?.map((file, index) => ({
      url: file.path,
      public_id: file.filename,
      isPrimary: index === 0,
    })) || [];

  const productData = {
    ...req.body,
    category,
    images,
  };
  if (brand) {
    productData.brand = brand;
  } else {
    delete productData.brand;
  }

  const product = await Product.create(productData);

  return res
    .status(201)
    .json(
      new ApiResponse(201, product, "Product created successfully")
    );
});

// @desc Get All Products
// @route GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find({ isActive: true })
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Product.countDocuments({ isActive: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Products fetched successfully"
    )
  );
});

// @desc Get Product By Id
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product fetched successfully")
    );
});


export const getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ ratingsAverage: -1 })
      .limit(8);

    const formattedProducts = products.map((product) => {
      const image =
        product.images.find((img) => img.isPrimary)?.url ||
        product.images[0]?.url ||
        "/images/headphone.png";

      const discount =
        product.discountPrice > 0
          ? Math.round(
              ((product.price - product.discountPrice) / product.price) * 100
            )
          : 0;

      return {
        id: product._id,
        _id: product._id,

        name: product.name,
        slug: product.slug,

        image,
        images: product.images,

        category: product.category,
        brand: product.brand,

        price: product.discountPrice || product.price,
        oldPrice:
          product.discountPrice > 0 ? product.price : null,

        discount,

        rating: product.ratingsAverage,
        reviews: product.reviews,

        stock: product.stock,
      };
    });

    res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top rated products",
    });
  }
};
// @desc Update Product
// @route PATCH /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product updated successfully")
    );
});

// @desc Delete Product
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      try {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      } catch (err) {
        console.log("Cloudinary Delete Error:", err.message);
      }
    }
  }

  await product.deleteOne();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product deleted successfully"
    )
  );
});

// @desc Upload Product Images
// @route POST /api/products/:id/images
export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!req.files?.length) {
    throw new ApiError(400, "No images uploaded");
  }

  const newImages = req.files.map((file) => ({
    url: file.path,
    public_id: file.filename,
    isPrimary: product.images.length === 0,
  }));

  product.images.push(...newImages);

  await product.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      product,
      "Images uploaded successfully"
    )
  );
});

// @desc Delete Product Image
// @route DELETE /api/products/:id/images/:imageId
export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const image = product.images.find(
    (img) => img.public_id === imageId
  );

  if (!image) {
    throw new ApiError(
      404,
      "Image not found on this product"
    );
  }

  // Delete image from Cloudinary
  if (image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  product.images = product.images.filter(
    (img) => img.public_id !== imageId
  );

  await product.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      product,
      "Image removed successfully"
    )
  );
});

// controllers/product/review.controller.js



export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const userId = req.user._id;

    const order = await Order.findOne({
      userId,
      orderStatus: "Delivered",
      "products.productId": productId,
    }); 

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can review only purchased products.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Already reviewed?
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    product.reviews.push({
      user: userId,
      rating,
      comment,
    });

    product.ratingsCount = product.reviews.length;

    product.ratingsAverage =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: "Review added successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};