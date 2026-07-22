import { body, param, query, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

// ===============================
// Validation Result Handler
// ===============================

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    })),
  });
};

// ===============================
// Helpers
// ===============================

const parseJsonArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

// ===============================
// CREATE PRODUCT
// ===============================

export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category id"),

  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isMongoId()
    .withMessage("Invalid brand id"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("discountPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Discount price must be positive"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),

  body("sku")
    .optional()
    .trim(),

  body("barcode")
    .optional()
    .trim(),

  body("tags")
    .optional()
    .customSanitizer(parseJsonArray),

  body("colors")
    .optional()
    .customSanitizer(parseJsonArray),

  body("sizes")
    .optional()
    .customSanitizer(parseJsonArray),

  body("features")
    .optional()
    .customSanitizer(parseJsonArray),

  body("specifications")
    .optional()
    .customSanitizer(parseJsonArray),

  body("measurement.type")
    .optional(),

  body("measurement.value")
    .optional()
    .isFloat({ min: 0 }),

  body("measurement.unit")
    .optional(),

  body("offerEnabled")
    .optional()
    .isBoolean(),

  body("offerValue")
    .optional()
    .isFloat({ min: 0 }),

  body("deliveryCharge")
    .optional()
    .isFloat({ min: 0 }),

  body("returnDays")
    .optional()
    .isInt({ min: 0 }),
  body("isActive")
    .optional()
    .isBoolean(),

  validate,
];

// ===============================
// UPDATE PRODUCT
// ===============================

export const updateProductValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("name")
    .optional()
    .trim(),

  body("slug")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("category")
    .optional()
    .isMongoId(),

  body("brand")
    .optional()
    .isMongoId(),

  body("price")
    .optional()
    .isFloat({ min: 0 }),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 }),

  body("stock")
    .optional()
    .isInt({ min: 0 }),

  body("tags")
    .optional()
    .customSanitizer(parseJsonArray),

  body("colors")
    .optional()
    .customSanitizer(parseJsonArray),

  body("sizes")
    .optional()
    .customSanitizer(parseJsonArray),

  body("features")
    .optional()
    .customSanitizer(parseJsonArray),

  body("specifications")
    .optional()
    .customSanitizer(parseJsonArray),

  validate,
];

// ===============================
// PRODUCT ID
// ===============================

export const productIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product id"),

  validate,
];

// ===============================
// PRODUCT QUERY
// ===============================

export const productQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 }),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 }),

  validate,
];