import Product from "../../models/product.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc Search & filter products
// @route GET /api/products/search
// Query params:
//   q          - free text search (name, description, tags)
//   category   - category id
//   brand      - brand id
//   minPrice, maxPrice - price range
//   minRating  - minimum ratingsAverage
//   inStock    - "true" to only return items with stock > 0
//   tags       - comma separated tags
//   sort       - "price_asc" | "price_desc" | "newest" | "rating" | "popular"
//   page, limit
export const searchProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    tags,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { isActive: true };

  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (inStock === "true") filter.stock = { $gt: 0 };
  if (minRating) filter.ratingsAverage = { $gte: Number(minRating) };
  if (tags) filter.tags = { $in: tags.split(",").map((t) => t.trim().toLowerCase()) };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { ratingsAverage: -1 },
    popular: { ratingsCount: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const skip = (Number(page) - 1) * Number(limit);

  const projection = q ? { score: { $meta: "textScore" } } : {};
  let query = Product.find(filter, projection)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .skip(skip)
    .limit(Number(limit));

  query = q ? query.sort({ score: { $meta: "textScore" } }) : query.sort(sortOption);

  const [products, total] = await Promise.all([query, Product.countDocuments(filter)]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Search results fetched successfully"
    )
  );
});

// @desc Get distinct filter options for a category (useful for building a filter sidebar)
// @route GET /api/products/filters
export const getFilterOptions = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const match = { isActive: true };
  if (category) match.category = category;

  const [brands, priceStats, tags] = await Promise.all([
    Product.distinct("brand", match),
    Product.aggregate([
      { $match: match },
      { $group: { _id: null, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } },
    ]),
    Product.distinct("tags", match),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        brands,
        tags,
        priceRange: priceStats[0]
          ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice }
          : { min: 0, max: 0 },
      },
      "Filter options fetched successfully"
    )
  );
});
