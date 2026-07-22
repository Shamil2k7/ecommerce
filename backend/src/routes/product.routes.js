import { Router } from "express";
import upload from "../config/multer.js";

/* ===========================
   PRODUCT CONTROLLERS
=========================== */
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
} from "../controllers/product/product.controller.js";
// import { getSubCategoriesByCategory } from "../controllers/product/subcategory.controller.js";


/* ===========================
   CATEGORY CONTROLLERS
=========================== */
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
 
} from "../controllers/product/category.controller.js";

/* ===========================
   BRAND CONTROLLERS
=========================== */
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/product/brand.controller.js";

/* ===========================
   SEARCH CONTROLLERS
=========================== */
import {
  searchProducts,
  getFilterOptions,
} from "../controllers/product/search.controller.js";

/* ===========================
   INVENTORY CONTROLLERS
=========================== */
import {
  setStock,
  adjustStock,
  getLowStockProducts,
  bulkUpdateStock,
} from "../controllers/product/inventory.controller.js";

/* ===========================
   VALIDATIONS
=========================== */
import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
} from "../validations/category.validation.js";

const router = Router();

/* =====================================================
                    SEARCH
===================================================== */

router.get(
  "/products/search",
  searchProducts
);

router.get(
  "/products/filters",
  getFilterOptions
);

/* =====================================================
                    INVENTORY
===================================================== */

router.get(
  "/products/inventory/low-stock",
  getLowStockProducts
);

router.patch(
  "/products/inventory/bulk",
  bulkUpdateStock
);

router.patch(
  "/products/:id/stock",
  setStock
);

router.patch(
  "/products/:id/stock/adjust",
  adjustStock
);

/* =====================================================
                    PRODUCTS
===================================================== */

router
  .route("/products")

  // GET ALL PRODUCTS
  .get(getAllProducts)

  // CREATE PRODUCT
  .post(
    upload.array("images", 10),
    createProduct
  );

router
  .route("/products/:id")

  // GET SINGLE PRODUCT
  .get(getProductById)

  // UPDATE PRODUCT
  .patch(
    upload.array("images", 10),
    updateProduct
  )

  // DELETE PRODUCT
  .delete(deleteProduct);

/* =====================================================
                  PRODUCT IMAGES
===================================================== */

router.post(
  "/products/:id/images",
  upload.array("images", 10),
  uploadProductImages
);

router.delete(
  "/products/:id/images/:imageId",
  deleteProductImage
);

/* =====================================================
                    CATEGORY
===================================================== */
// router.get(
//   "/categories/:id/subcategories",
//   getSubCategoriesByCategory
// );
router.route("/categories")

  // GET ALL CATEGORIES
  .get(getAllCategories)

  // CREATE CATEGORY
  .post(
    upload.single("image"),
    createCategoryValidation,
    createCategory
  );

router
  .route("/categories/:id")

  // GET CATEGORY
  .get(
    categoryIdValidation,
    getCategoryById
  )

  // UPDATE CATEGORY
  .patch(
    upload.single("image"),
    categoryIdValidation,
    updateCategoryValidation,
    updateCategory
  )

  // DELETE CATEGORY
  .delete(
    categoryIdValidation,
    deleteCategory
  );

/* =====================================================
                    BRANDS
===================================================== */

router
  .route("/brands")

  // GET ALL BRANDS
  .get(getAllBrands)

  // CREATE BRAND
  .post(
    upload.single("logo"),
    createBrand
  );

router
  .route("/brands/:id")

  // GET BRAND
  .get(getBrandById)

  // UPDATE BRAND
  .patch(
    upload.single("logo"),
    updateBrand
  )

  // DELETE BRAND
  .delete(deleteBrand);

export default router;