import { body, param, query, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  return next(new ApiError(422, "Validation failed", formatted));
};

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").isMongoId().withMessage("Valid category id is required"),
  body("brand").optional().isMongoId().withMessage("Invalid brand id"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("sku").optional().trim(),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  validate,
];

export const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product id"),
  body("name").optional().trim().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("discountPrice").optional().isFloat({ min: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("category").optional().isMongoId(),
  body("brand").optional().isMongoId(),
  validate,
];

export const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product id"),
  validate,
];

export const productQueryValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  validate,
];
