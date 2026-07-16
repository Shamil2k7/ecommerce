import Product from "../../models/product.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc Set absolute stock value for a product
// @route PATCH /api/products/:id/stock
export const setStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) {
    throw new ApiError(400, "A valid non-negative stock value is required");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );
  if (!product) throw new ApiError(404, "Product not found");

  return res.status(200).json(new ApiResponse(200, product, "Stock updated successfully"));
});

// @desc Increment/decrement stock relatively (e.g. after an order or restock)
// @route PATCH /api/products/:id/stock/adjust  body: { delta: number }
export const adjustStock = asyncHandler(async (req, res) => {
  const { delta } = req.body;
  if (delta === undefined || typeof delta !== "number") {
    throw new ApiError(400, "A numeric delta is required (negative to decrease stock)");
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const newStock = product.stock + delta;
  if (newStock < 0) throw new ApiError(400, "Insufficient stock for this operation");

  product.stock = newStock;
  await product.save();

  return res.status(200).json(new ApiResponse(200, product, "Stock adjusted successfully"));
});

// @desc List products at or below a low-stock threshold
// @route GET /api/products/inventory/low-stock?threshold=10
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold) || 10;

  const products = await Product.find({ isActive: true, stock: { $lte: threshold } })
    .select("name sku stock price")
    .sort({ stock: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Low stock products fetched successfully"));
});

// @desc Bulk update stock, e.g. [{ productId, stock }]
// @route PATCH /api/products/inventory/bulk
export const bulkUpdateStock = asyncHandler(async (req, res) => {
  const { updates } = req.body; // [{ productId, stock }]
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new ApiError(400, "updates must be a non-empty array of { productId, stock }");
  }

  const bulkOps = updates.map(({ productId, stock }) => ({
    updateOne: {
      filter: { _id: productId },
      update: { $set: { stock } },
    },
  }));

  const result = await Product.bulkWrite(bulkOps);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Bulk stock update completed successfully"));
});
