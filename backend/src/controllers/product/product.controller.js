import fs from "fs";
import path from "path";
import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Brand from "../../models/brand.model.js";

// @desc Create product (multipart/form-data, field "images" up to 6 files)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { category, brand } = req.body;

const categoryExists = await Category.findById(category);
if (!categoryExists) {
  throw new ApiError(404, "Category not found");
}

const brandExists = await Brand.findById(brand);
if (!brandExists) {
  throw new ApiError(404, "Brand not found");
}

const images =
  req.files?.map((file, index) => ({
    url: `/uploads/products/${file.filename}`,
    public_id: file.filename,
    isPrimary: index === 0,
  })) || [];

const product = await Product.create({
  ...req.body,
  category,
  brand,
  images,
});

return res
  .status(201)
  .json(new ApiResponse(201, product, "Product created successfully"));

  return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

// @desc Get all products (basic pagination, use searchController for search/filters)
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

// @desc Get single product by id
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) throw new ApiError(404, "Product not found");

  return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// @desc Update product details (does not touch images, see uploadProductImages)
// @route PATCH /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ApiError(404, "Product not found");

  return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// @desc Delete product (also removes its images from disk)
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  product.images.forEach((img) => {
    const filePath = path.join(process.cwd(), "src", "uploads", "products", img.public_id);
    fs.unlink(filePath, () => {}); // best-effort cleanup, ignore errors
  });

  return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// @desc Add more images to an existing product
// @route POST /api/products/:id/images
export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  if (!req.files?.length) throw new ApiError(400, "No images uploaded");

  const newImages = req.files.map((file) => ({
    url: `/uploads/products/${file.filename}`,
    public_id: file.filename,
    isPrimary: product.images.length === 0,
  }));

  product.images.push(...newImages);
  await product.save();

  return res.status(200).json(new ApiResponse(200, product, "Images uploaded successfully"));
});

// @desc Remove a single image from a product
// @route DELETE /api/products/:id/images/:imageId
export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  const image = product.images.find((img) => img.public_id === imageId);
  if (!image) throw new ApiError(404, "Image not found on this product");

  product.images = product.images.filter((img) => img.public_id !== imageId);
  await product.save();

  const filePath = path.join(process.cwd(), "src", "uploads", "products", imageId);
  fs.unlink(filePath, () => {});

  return res.status(200).json(new ApiResponse(200, product, "Image removed successfully"));
});
