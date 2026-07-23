import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
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
      default: "",
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

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    products: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, "Order must contain at least one product"],
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "UPI",
        "Credit Card",
        "Debit Card",
        "Net Banking",
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },
    },

    shipDate: {
      type: Date,
    },

    refundRequested: {
      type: Boolean,
      default: false,
    },

    refundStatus: {
      type: String,
      enum: [
        "None",
        "Pending",
        "Approved",
        "Rejected",
        "Completed",
      ],
      default: "None",
    },

    refundReason: {
      type: String,
      default: "",
    },

    refundDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);