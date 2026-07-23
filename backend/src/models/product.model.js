import mongoose, { Schema } from "mongoose";

/* ---------- Variant ---------- */

const variantSchema = new Schema(
  {
    size: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
      unique: false,
    },

    price: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/* ===========================
   Review Schema
=========================== */

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   Image Schema
=========================== */

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/* ===========================
   Product Schema
=========================== */

const productSchema = new Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Inventory
    sku: {
      type: String,
      unique: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Images
    images: [imageSchema],

    // Variants
    variants: [variantSchema],

    // Tags
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Reviews
    reviews: [reviewSchema],

    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    // Product Flags
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Vendor
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },

    // Admin
    adminNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   Indexes
=========================== */

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

productSchema.index({
  category: 1,
  brand: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  isFeatured: 1,
  isTrending: 1,
  isBestSeller: 1,
  isNewArrival: 1,
});

export default mongoose.model("Product", productSchema);