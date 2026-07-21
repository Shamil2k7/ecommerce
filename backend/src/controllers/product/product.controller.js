import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import Brand from "../../models/brand.model.js";
import cloudinary from "../../config/cloudinary.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/* =======================================================
   Helpers
======================================================= */

const parseJSON = (value, fallback = []) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

/* =======================================================
   CREATE PRODUCT
   POST /api/products
======================================================= */

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,

    category,
    brand,

    price,
    discountPrice,

    sku,
    stock,

    measurement,

    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    isActive,
  } = req.body;

  /* -----------------------------
     Validation
  ------------------------------ */

  if (!name || !name.trim()) {
    throw new ApiError(400, "Product name is required");
  }

  if (!description || !description.trim()) {
    throw new ApiError(400, "Description is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new ApiError(400, "Invalid Category ID");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  if (!brand) {
    throw new ApiError(400, "Brand is required");
  }

  if (!mongoose.Types.ObjectId.isValid(brand)) {
    throw new ApiError(400, "Invalid Brand ID");
  }

  const brandExists = await Brand.findById(brand);
  if (!brandExists) {
    throw new ApiError(404, "Brand not found");
  }

  if (price === undefined || price === null || price === "" || isNaN(Number(price))) {
    throw new ApiError(400, "Valid price is required");
  }

  const numericPrice = Number(price);
  if (numericPrice < 0) {
    throw new ApiError(400, "Price must be greater than or equal to 0");
  }

  const numericDiscountPrice = discountPrice !== undefined && discountPrice !== null && discountPrice !== "" ? Number(discountPrice) : 0;
  const numericStock = stock !== undefined && stock !== null && stock !== "" ? Number(stock) : 0;

  /* -----------------------------
     Slug Generation / Unique Check
  ------------------------------ */

  let productSlug = slug?.trim();

  if (!productSlug) {
    productSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const slugExists = await Product.findOne({ slug: productSlug });
  if (slugExists) {
    productSlug = `${productSlug}-${Date.now()}`;
  }

  /* -----------------------------
     Duplicate SKU Check
  ------------------------------ */

  let productSku = sku?.trim();
  if (productSku) {
    const skuExists = await Product.findOne({ sku: productSku });
    if (skuExists) {
      throw new ApiError(400, "SKU already exists");
    }
  } else {
    productSku = undefined;
  }

  /* -----------------------------
     Images
  ------------------------------ */

  const images =
    req.files?.map((file, index) => ({
      url: file.path,
      public_id: file.filename,
      isPrimary: index === 0,
    })) || [];

  /* -----------------------------
     Arrays
  ------------------------------ */

  const tags = parseArrayField(req.body.tags);
  const colors = parseArrayField(req.body.colors);
  const sizes = parseArrayField(req.body.sizes);
  const variants = parseJSON(req.body.variants, []);
  const specifications = parseJSON(req.body.specifications, []);
  const features = parseArrayField(req.body.features);

  /* -----------------------------
     Objects & Form Data Sub-fields
  ------------------------------ */

  let measurementData = parseJSON(measurement, {});
  if (typeof measurementData !== "object" || measurementData === null) measurementData = {};
  if (req.body["measurement[type]"]) measurementData.type = req.body["measurement[type]"];
  if (req.body["measurement[value]"]) measurementData.value = Number(req.body["measurement[value]"]) || 0;
  if (req.body["measurement[unit]"]) measurementData.unit = req.body["measurement[unit]"];

  let offer = parseJSON(req.body.offer, {});
  if (typeof offer !== "object" || offer === null) offer = {};
  if (req.body.offerEnabled !== undefined) offer.enabled = req.body.offerEnabled === true || req.body.offerEnabled === "true";
  if (req.body.offerTitle) offer.title = req.body.offerTitle;
  if (req.body.offerType) offer.type = req.body.offerType;
  if (req.body.offerValue !== undefined && req.body.offerValue !== "") offer.value = Number(req.body.offerValue) || 0;
  if (req.body.offerStartDate) offer.startDate = req.body.offerStartDate;
  if (req.body.offerEndDate) offer.endDate = req.body.offerEndDate;

  let shipping = parseJSON(req.body.shipping, {});
  if (typeof shipping !== "object" || shipping === null) shipping = {};
  if (req.body.freeDelivery !== undefined) shipping.freeDelivery = req.body.freeDelivery === true || req.body.freeDelivery === "true";
  if (req.body.deliveryCharge !== undefined && req.body.deliveryCharge !== "") shipping.deliveryCharge = Number(req.body.deliveryCharge) || 0;
  if (req.body.estimatedDays !== undefined && req.body.estimatedDays !== "") shipping.estimatedDays = Number(req.body.estimatedDays) || 0;
  if (req.body.cashOnDelivery !== undefined) shipping.cashOnDelivery = req.body.cashOnDelivery === true || req.body.cashOnDelivery === "true";
  if (req.body.expressDelivery !== undefined) shipping.expressDelivery = req.body.expressDelivery === true || req.body.expressDelivery === "true";

  let returnPolicy = parseJSON(req.body.returnPolicy, {});
  if (typeof returnPolicy !== "object" || returnPolicy === null) returnPolicy = {};
  if (req.body.returnAvailable !== undefined) returnPolicy.returnAvailable = req.body.returnAvailable === true || req.body.returnAvailable === "true";
  if (req.body.refundAvailable !== undefined) returnPolicy.refundAvailable = req.body.refundAvailable === true || req.body.refundAvailable === "true";
  if (req.body.replacementAvailable !== undefined) returnPolicy.replacementAvailable = req.body.replacementAvailable === true || req.body.replacementAvailable === "true";
  if (req.body.returnDays !== undefined && req.body.returnDays !== "") returnPolicy.returnDays = Number(req.body.returnDays) || 7;
  if (req.body.warranty) returnPolicy.warranty = req.body.warranty;

  let seo = parseJSON(req.body.seo, {});
  if (typeof seo !== "object" || seo === null) seo = {};
  if (req.body.seoTitle) seo.title = req.body.seoTitle;
  if (req.body.seoDescription) seo.description = req.body.seoDescription;
  if (req.body.seoKeywords) seo.keywords = req.body.seoKeywords;

  /* -----------------------------
     Create Product
  ------------------------------ */

  const product = await Product.create({
    name: name.trim(),
    slug: productSlug,
    description: description.trim(),

    category,
    brand,

    price: numericPrice,
    discountPrice: numericDiscountPrice,

    sku: productSku,
    stock: numericStock,

    images,

    tags,
    colors,
    sizes,
    variants,

    measurement: measurementData,
    specifications,
    features,

    offer,
    shipping,
    returnPolicy,
    seo,

    isFeatured: isFeatured === true || isFeatured === "true",
    isTrending: isTrending === true || isTrending === "true",
    isBestSeller: isBestSeller === true || isBestSeller === "true",
    isNewArrival: isNewArrival === true || isNewArrival === "true",
    isActive: isActive === undefined ? true : isActive === true || isActive === "true",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      product,
      "Product created successfully"
    )
  );
});

/* =======================================================
   GET ALL PRODUCTS
   GET /api/products
======================================================= */

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    featured,
    active = true,
    sort = "newest",
  } = req.query;

  const filter = {};

  if (active !== undefined && active !== null && active !== "") {
    filter.isActive = active === "true" || active === true;
  }

  if (category && mongoose.Types.ObjectId.isValid(category)) {
    filter.category = category;
  }

  if (brand && mongoose.Types.ObjectId.isValid(brand)) {
    filter.brand = brand;
  }

  if (featured) {
    filter.isFeatured = featured === "true" || featured === true;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice && !isNaN(Number(minPrice))) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  let sortOption = {};
  switch (sort) {
    case "priceLow":
      sortOption = { price: 1 };
      break;
    case "priceHigh":
      sortOption = { price: -1 };
      break;
    case "rating":
      sortOption = { ratingsAverage: -1 };
      break;
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),

    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Products fetched successfully"
    )
  );
});

/* =======================================================
   GET PRODUCT BY ID
   GET /api/products/:id
======================================================= */

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id)
    .populate("category")
    .populate("brand");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Related products
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category?._id,
    isActive: true,
  })
    .limit(8)
    .select("name price discountPrice images slug");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product,
        relatedProducts,
      },
      "Product fetched successfully"
    )
  );
});

/* =======================================================
   UPDATE PRODUCT
   PATCH /api/products/:id
======================================================= */

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Validate Category
  if (req.body.category) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      throw new ApiError(400, "Invalid Category ID");
    }
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
    product.category = req.body.category;
  }

  // Validate Brand
  if (req.body.brand) {
    if (!mongoose.Types.ObjectId.isValid(req.body.brand)) {
      throw new ApiError(400, "Invalid Brand ID");
    }
    const brandExists = await Brand.findById(req.body.brand);
    if (!brandExists) {
      throw new ApiError(404, "Brand not found");
    }
    product.brand = req.body.brand;
  }

  // Basic Information
  if (req.body.name) product.name = req.body.name.trim();
  if (req.body.slug) product.slug = req.body.slug.trim();
  if (req.body.description) product.description = req.body.description.trim();

  // Pricing
  if (req.body.price !== undefined && req.body.price !== "") {
    product.price = Number(req.body.price);
  }

  if (req.body.discountPrice !== undefined && req.body.discountPrice !== "") {
    product.discountPrice = Number(req.body.discountPrice);
  }

  if (req.body.stock !== undefined && req.body.stock !== "") {
    product.stock = Number(req.body.stock);
  }

  if (req.body.sku) {
    product.sku = req.body.sku.trim();
  }

  // Measurement
  if (req.body.measurement) {
    product.measurement = typeof req.body.measurement === "string" ? parseJSON(req.body.measurement, {}) : req.body.measurement;
  }

  // Tags
  if (req.body.tags) {
    product.tags = parseArrayField(req.body.tags);
  }

  // Colors
  if (req.body.colors) {
    product.colors = parseArrayField(req.body.colors);
  }

  // Sizes
  if (req.body.sizes) {
    product.sizes = parseArrayField(req.body.sizes);
  }

  // Features
  if (req.body.features) {
    product.features = parseArrayField(req.body.features);
  }

  // Variants
  if (req.body.variants) {
    product.variants = parseJSON(req.body.variants, []);
  }

  // Offer
  if (req.body.offer) {
    product.offer = parseJSON(req.body.offer, {});
  }

  // Services
  if (req.body.services) {
    product.services = parseJSON(req.body.services, {});
  }

  // SEO
  if (req.body.seo) {
    product.seo = parseJSON(req.body.seo, {});
  }

  // Warranty
  if (req.body.warranty) {
    product.warranty = parseJSON(req.body.warranty, {});
  }

  // Specifications
  if (req.body.specifications) {
    product.specifications = parseJSON(req.body.specifications, []);
  }

  // Shipping
  if (req.body.shipping) {
    product.shipping = parseJSON(req.body.shipping, {});
  }

  // Status
  if (req.body.isFeatured !== undefined) {
    product.isFeatured = req.body.isFeatured === true || req.body.isFeatured === "true";
  }

  if (req.body.isActive !== undefined) {
    product.isActive = req.body.isActive === true || req.body.isActive === "true";
  }

  // Save Product
  await product.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      product,
      "Product updated successfully"
    )
  );
});

/* =======================================================
   DELETE PRODUCT
   DELETE /api/products/:id
======================================================= */

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
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

/* =======================================================
   DELETE PRODUCT IMAGE
   DELETE /api/products/:id/images/:imageId
======================================================= */

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const image = product.images.find(
    (img) => img.public_id === imageId
  );

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  await cloudinary.uploader.destroy(image.public_id);

  product.images = product.images.filter(
    (img) => img.public_id !== imageId
  );

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, product, "Image deleted successfully")
  );
});

/* =======================================================
   UPLOAD PRODUCT IMAGES
   POST /api/products/:id/images
======================================================= */

export const uploadProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images uploaded");
  }

  const images = req.files.map((file, index) => ({
    url: file.path,
    public_id: file.filename,
    isPrimary: product.images.length === 0 && index === 0,
  }));

  product.images.push(...images);

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, product, "Images uploaded successfully")
  );
});