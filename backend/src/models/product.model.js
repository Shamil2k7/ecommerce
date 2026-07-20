import mongoose, { Schema } from "mongoose";

/* ---------- Variant ---------- */

const variantSchema = new Schema(
  {
    color: String,
    size: String,
    sku: String,
    price: Number,
    stock: Number,

    images: [
      {
        url: String,
        public_id: String,
      },
    ],
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
      unique: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: String,

    sku: {
      type: String,
      unique: true,
    },

    barcode: String,

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

    costPrice: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // Inventory

    stock: {
      type: Number,
      default: 0,
    },

    lowStockAlert: {
      type: Number,
      default: 5,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    // Measurement

    measurement: {
      type: {
        type: String,
        enum: ["weight", "volume", "qty"],
      },

      value: Number,

      unit: String,
    },

    // Colors

    colors: [
      {
        name: String,
        code: String,
      },
    ],

    // Sizes

    sizes: [String],

    // Variants

    variants: [variantSchema],

    // Images

    images: [
      {
        url: String,
        public_id: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Video

    videoUrl: String,

    // Offer

    offer: {
      enabled: {
        type: Boolean,
        default: false,
      },

      title: String,

      type: {
        type: String,
        enum: ["percentage", "flat"],
      },

      value: Number,

      startDate: Date,

      endDate: Date,
    },

    // Shipping

    shipping: {
      freeDelivery: {
        type: Boolean,
        default: false,
      },

      deliveryCharge: {
        type: Number,
        default: 0,
      },

      estimatedDays: {
        type: String,
        default: "3-5 Days",
      },

      cashOnDelivery: {
        type: Boolean,
        default: true,
      },

      expressDelivery: {
        type: Boolean,
        default: false,
      },
    },

    // Return Policy

    returnPolicy: {
      returnAvailable: {
        type: Boolean,
        default: true,
      },

      returnDays: {
        type: Number,
        default: 7,
      },

      refundAvailable: {
        type: Boolean,
        default: true,
      },

      replacementAvailable: {
        type: Boolean,
        default: true,
      },

      warranty: String,
    },

    // Features

    features: [String],

    // Specifications

    specifications: [
      {
        key: String,
        value: String,
      },
    ],

    // SEO

    seo: {
      title: String,

      description: String,

      keywords: [String],
    },

    // Tags

    tags: [String],

    // Rating

    ratingsAverage: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    // Visibility

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