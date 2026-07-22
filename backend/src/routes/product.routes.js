import { Router } from "express";
import upload from "../config/multer.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
} from "../controllers/product/product.controller.js";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/product/category.controller.js";

import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/product/brand.controller.js";

import { searchProducts, getFilterOptions } from "../controllers/product/search.controller.js";

import {
  setStock,
  adjustStock,
  getLowStockProducts,
  bulkUpdateStock,
} from "../controllers/product/inventory.controller.js";

const router = Router();

/* ---------- Search & Filters (declared before "/:id" routes to avoid conflicts) ---------- */
router.get("/products/search", searchProducts);
router.get("/products/filters", getFilterOptions);

/* ---------- Inventory ---------- */
router.get("/products/inventory/low-stock", getLowStockProducts);
router.patch("/products/inventory/bulk", bulkUpdateStock);
router.patch("/products/:id/stock", setStock);
router.patch("/products/:id/stock/adjust", adjustStock);

/* ---------- Products CRUD ---------- */
router
  .route("/products")
  .get(getAllProducts)
  .post(upload.array("images", 6), createProduct);

router
  .route("/products/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

/* ---------- Product Images ---------- */
router.post(
  "/products/:id/images",
  upload.array("images", 6),
  uploadProductImages
);
router.delete("/products/:id/images/:imageId", deleteProductImage);

/* ---------- Categories CRUD ---------- */
router
  .route("/categories")
  .get(getAllCategories)
  .post(upload.single("image"), createCategory);

router
  .route("/categories/:id")
  .get(getCategoryById)
  .patch(upload.single("image"), updateCategory)
  .delete(deleteCategory);

/* ---------- Brands CRUD ---------- */
router
  .route("/brands")
  .get(getAllBrands)
  .post(upload.single("logo"), createBrand);

router
  .route("/brands/:id")
  .get(getBrandById)
  .patch(upload.single("logo"), updateBrand)
  .delete(deleteBrand);

export default router;
