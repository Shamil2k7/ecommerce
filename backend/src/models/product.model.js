import mongoose, { Schema } from "mongoose";

/* ===========================
   Variant Schema
=========================== */

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
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
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
   Specification Schema
=========================== */

const specificationSchema = new Schema(
  {
    key: {
      type: String,
      trim: true,
    },

    value: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/* ===========================
   Product Schema
=========================== */

const productSchema = new Schema(
  {
    /* ===========================
       BASIC
    =========================== */

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

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    /* ===========================
       PRICING
    =========================== */

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    /* ===========================
       INVENTORY
    =========================== */

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    barcode: {
      type: String,
      trim: true,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    /* ===========================
       MEASUREMENT
    =========================== */

    measurement: {
      type: {
        type: String,
        enum: ["weight", "volume", "qty", ""],
        default: "",
      },

      value: {
        type: Number,
        default: 0,
      },

      unit: {
        type: String,
        default: "",
      },
    },

    /* ===========================
       IMAGES
    =========================== */

    images: [imageSchema],

    /* ===========================
       COLORS
    =========================== */

    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ===========================
       SIZES
    =========================== */

    sizes: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ===========================
       FEATURES
    =========================== */

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ===========================
       SPECIFICATIONS
    =========================== */

    specifications: [specificationSchema],

    /* ===========================
       VARIANTS
    =========================== */

    variants: [variantSchema],

    /* ===========================
       OFFER
    =========================== */

    offerEnabled: {
      type: Boolean,
      default: false,
    },

    offerTitle: {
      type: String,
      default: "",
    },

    offerType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    offerValue: {
      type: Number,
      default: 0,
    },

    offerStartDate: {
      type: Date,
    },

    offerEndDate: {
      type: Date,
    },

    /* ===========================
       SHIPPING
    =========================== */

    freeDelivery: {
      type: Boolean,
      default: false,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    estimatedDays: {
      type: Number,
      default: 0,
    },

    cashOnDelivery: {
      type: Boolean,
      default: true,
    },

    expressDelivery: {
      type: Boolean,
      default: false,
    },

    /* ===========================
       RETURN POLICY
    =========================== */

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

    warranty: {
      type: String,
      default: "",
    },

    /* ===========================
       SEO
    =========================== */

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },

    seoKeywords: {
      type: String,
      default: "",
    },

    /* ===========================
       TAGS
    =========================== */

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    /* ===========================
       REVIEWS
    =========================== */

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

    /* ===========================
       FLAGS
    =========================== */

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

    /* ===========================
       ADMIN
    =========================== */

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   INDEXES
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