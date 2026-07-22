import Category from "../../models/category.model.js";
import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc Create category
// @route POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) throw new ApiError(409, "Category with this name already exists");

  const image = req.file
    ? { url: req.file.path, public_id: req.file.filename }
    : undefined;

  const category = await Category.create({
    name,
    description,
    parentCategory: parentCategory || null,
    image,
  });

  return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

// @desc Get all categories (flat list, optionally filtered by parent)
// @route GET /api/categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const { parentCategory, isActive } = req.query;

  const filter = {};
  if (parentCategory) filter.parentCategory = parentCategory;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const categories = await Category.find(filter)
    .populate("parentCategory", "name slug")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// @desc Get single category by id or slug
// @route GET /api/categories/:id
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("parentCategory", "name slug");

  if (!category) throw new ApiError(404, "Category not found");

  return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

// @desc Update category
// @route PATCH /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  const updates = { ...req.body };

  if (req.file) {
    if (category.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (err) {
        console.log("Cloudinary Delete Error:", err.message);
      }
    }
    updates.image = { url: req.file.path, public_id: req.file.filename };
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});

// @desc Delete category
// @route DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Delete all child categories & their images from Cloudinary
  const children = await Category.find({ parentCategory: id });
  for (const child of children) {
    if (child.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(child.image.public_id);
      } catch (err) {
        console.log("Cloudinary Delete Error:", err.message);
      }
    }
  }
  await Category.deleteMany({ parentCategory: id });

  // Delete parent category image from Cloudinary
  if (category.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(category.image.public_id);
    } catch (err) {
      console.log("Cloudinary Delete Error:", err.message);
    }
  }

  await category.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Category deleted successfully")
  );
});
