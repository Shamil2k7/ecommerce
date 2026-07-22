import mongoose from "mongoose";
import Category from "../../models/category.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc Create category
// @route POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  const trimmedName = name.trim();

  const existing = await Category.findOne({ name: trimmedName });
  if (existing) throw new ApiError(409, "Category with this name already exists");

  if (parentCategory && !mongoose.Types.ObjectId.isValid(parentCategory)) {
    throw new ApiError(400, "Invalid parent category ID");
  }

  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) throw new ApiError(404, "Parent category not found");
  }

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const image = req.file
    ? { url: `/uploads/products/${req.file.filename}`, public_id: req.file.filename }
    : undefined;

  const category = await Category.create({
    name: trimmedName,
    slug,
    description: description ? description.trim() : "",
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
  if (parentCategory) {
    if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
      throw new ApiError(400, "Invalid parent category ID");
    }
    filter.parentCategory = parentCategory;
  }
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(id).populate("parentCategory", "name slug");

  if (!category) throw new ApiError(404, "Category not found");

  return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

// @desc Update category
// @route PATCH /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  const updates = { ...req.body };

  if (updates.name && updates.name.trim()) {
    const trimmedName = updates.name.trim();
    const existing = await Category.findOne({ name: trimmedName, _id: { $ne: id } });
    if (existing) throw new ApiError(409, "Category with this name already exists");
    updates.name = trimmedName;
    updates.slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  if (updates.parentCategory) {
    if (!mongoose.Types.ObjectId.isValid(updates.parentCategory)) {
      throw new ApiError(400, "Invalid parent category ID");
    }
    if (updates.parentCategory === id) {
      throw new ApiError(400, "Category cannot be its own parent");
    }
  }

  if (req.file) {
    updates.image = { url: `/uploads/products/${req.file.filename}`, public_id: req.file.filename };
  }

  Object.assign(category, updates);
  await category.save();

  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

// @desc Delete category
// @route DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const childCount = await Category.countDocuments({ parentCategory: id });
  if (childCount > 0) {
    throw new ApiError(400, "Cannot delete a category that has subcategories");
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "Category not found");

  return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});