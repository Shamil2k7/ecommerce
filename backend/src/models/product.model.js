import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema(
  {
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    sku: { type: String, trim: true },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variants: [variantSchema],
    tags: [{ type: String, trim: true, lowercase: true }],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);
  }
});

// Text index powers the search controller ($text search on name/description/tags)
productSchema.index({ name: "text", description: "text", tags: "text" });
// Compound index to speed up common filter combinations
productSchema.index({ category: 1, brand: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
