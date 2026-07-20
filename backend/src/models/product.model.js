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
    },
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

/* ---------- Review ---------- */

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: String,
  },
  {
    timestamps: true,
  }
);

/* ---------- Product ---------- */

const productSchema = new Schema(
  {
    // Basic

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      default: "INR",
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: [true, "Image URL is required"],
        },
        public_id: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    variants: [variantSchema],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

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
    },

    // Admin

    adminNote: String,
  },
  {
    timestamps: true,
  }
);

// Search Index

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

productSchema.index({
  category: 1,
  brand: 1,
  price: 1,
});

export default mongoose.model("Product", productSchema);
