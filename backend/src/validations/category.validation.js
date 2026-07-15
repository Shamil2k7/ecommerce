import { body, param } from "express-validator";
import { validate } from "./product.validation.js";

export const createCategoryValidation = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("parentCategory").optional().isMongoId().withMessage("Invalid parent category id"),
  validate,
];

export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category id"),
  body("name").optional().trim().notEmpty(),
  body("parentCategory").optional().isMongoId(),
  validate,
];

export const categoryIdValidation = [
  param("id").isMongoId().withMessage("Invalid category id"),
  validate,
];
