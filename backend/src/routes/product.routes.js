import { Router } from "express";
import upload from "../config/multer.js";


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
router.get("/products/inventory/low-stock", getLowStockProducts);
router.patch("/products/inventory/bulk", bulkUpdateStock);
router.patch("/products/:id/stock", setStock);
router.patch("/products/:id/stock/adjust", adjustStock);

/* =====================================================
                    PRODUCTS
===================================================== */

// Top Rated
router.get("/products/top-rated", getTopRatedProducts);

// All Products + Create
router
  .route("/products")
  .get(getAllProducts)
  .post(upload.array("images", 10), createProduct);

// Single Product
router
  .route("/products/:id")
  .get(getProductById)
  .patch(upload.array("images", 10), updateProduct)
  .delete(deleteProduct);
/* =====================================================
                  PRODUCT IMAGES
===================================================== */
router.post(
  "/products/:id/images",
  upload.array("images", 10),
  uploadProductImages
);
router.delete(/^\/products\/([^/]+)\/images\/(.+)$/, (req, res, next) => {
  req.params.id = req.params[0];
  req.params.imageId = req.params[1];
  next();
}, deleteProductImage);

/* =====================================================
                    CATEGORY
===================================================== */
router.route("/categories")
  .get(getAllCategories)
  .post(
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
  .delete(deleteCategory);
  
  router.post("/products/:productId/review",addReview);
/* =====================================================
                    BRANDS
===================================================== */
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

