import Brand from "../../models/brand.model.js";
import cloudinary from "../../config/cloudinary.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc Create Brand
// @route POST /api/brands
export const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Brand.findOne({
    name: name.trim(),
  });

  if (existing) {
    throw new ApiError(
      409,
      "Brand with this name already exists"
    );
  }

  const logo = req.file
    ? {
        url: req.file.path,
        public_id: req.file.filename,
      }
    : undefined;

  const brand = await Brand.create({
    name,
    description,
    logo,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      brand,
      "Brand created successfully"
    )
  );
});

// @desc Get All Brands
// @route GET /api/brands
export const getAllBrands = asyncHandler(async (req, res) => {
  const { isActive } = req.query;

  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const brands = await Brand.find(filter).sort({
    name: 1,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      brands,
      "Brands fetched successfully"
    )
  );
});

// @desc Get Brand By Id
// @route GET /api/brands/:id
export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      brand,
      "Brand fetched successfully"
    )
  );
});

// @desc Update Brand
// @route PATCH /api/brands/:id
export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  const updates = {
    ...req.body,
  };

  if (req.file) {
    // Delete old logo from Cloudinary
    if (brand.logo?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          brand.logo.public_id
        );
      } catch (err) {
        console.log(
          "Cloudinary Delete Error:",
          err.message
        );
      }
    }

    updates.logo = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedBrand,
      "Brand updated successfully"
    )
  );
});

// @desc Delete Brand
// @route DELETE /api/brands/:id
export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  // Delete logo from Cloudinary
  if (brand.logo?.public_id) {
    try {
      await cloudinary.uploader.destroy(
        brand.logo.public_id
      );
    } catch (err) {
      console.log(
        "Cloudinary Delete Error:",
        err.message
      );
    }
  }

  await brand.deleteOne();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Brand deleted successfully"
    )
  );
});