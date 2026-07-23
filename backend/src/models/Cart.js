import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    stock: {
      type: Number,
      required: true,
    },

    // ADD THIS
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true,
},

    products: [cartItemSchema],

    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    offerApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    offerDiscount: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    finalTotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);