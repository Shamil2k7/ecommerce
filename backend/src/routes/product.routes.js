import { Router } from "express";
import upload from "../config/multer.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";
import { getAllReviews } from "../controllers/product/review.controller.js";
import {
  getTopRatedProducts,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  addReview,
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

/* =====================================================
                    SEARCH
===================================================== */
router.get("/products/search", searchProducts);
router.get("/products/filters", getFilterOptions);

/* =====================================================
                    INVENTORY
===================================================== */
router.get("/products/inventory/low-stock", protect, isAdminOrStaff, getLowStockProducts);
router.patch("/products/inventory/bulk", protect, isAdminOrStaff, bulkUpdateStock);
router.patch("/products/:id/stock", protect, isAdminOrStaff, setStock);
router.patch("/products/:id/stock/adjust", protect, isAdminOrStaff, adjustStock);

/* =====================================================
                    PRODUCTS
===================================================== */

// Top Rated
router.get("/products/top-rated", getTopRatedProducts);

// All Products + Create
router
  .route("/products")
  .get(getAllProducts)
  .post(protect, isAdminOrStaff, upload.array("images", 10), createProduct);

// Single Product
router
  .route("/products/:id")
  .get(getProductById)
  .patch(protect, isAdminOrStaff, upload.array("images", 10), updateProduct)
  .delete(protect, isAdminOrStaff, deleteProduct);
/* =====================================================
                  PRODUCT IMAGES
===================================================== */
router.post(
  "/products/:id/images",
  protect, isAdminOrStaff,
  upload.array("images", 10),
  uploadProductImages
);
router.delete(/^\/products\/([^/]+)\/images\/(.+)$/, (req, res, next) => {
  req.params.id = req.params[0];
  req.params.imageId = req.params[1];
  next();
}, protect, isAdminOrStaff, deleteProductImage);

/* =====================================================
                    CATEGORY
===================================================== */
router.route("/categories")
  .get(getAllCategories)
  .post(
    protect, isAdminOrStaff,
    upload.single("image"),
    createCategory
  );

router
  .route("/categories/:id")
  .get(getCategoryById)
  .patch(
    upload.single("image"),
    updateCategory
  )
  .delete(protect, isAdminOrStaff, deleteCategory);

router.post("/products/:productId/review", protect, addReview);
/* =====================================================
                    BRANDS
===================================================== */
router
  .route("/brands")
  .get(getAllBrands)
  .post(protect, isAdminOrStaff, upload.single("logo"), createBrand);

router
  .route("/brands/:id")
  .get(getBrandById)
  .patch(upload.single("logo"), updateBrand)
  .delete(protect, isAdminOrStaff, deleteBrand);

export default router;

router.get(
  "/reviews",
  protect,
  isAdminOrStaff,
  getAllReviews
);