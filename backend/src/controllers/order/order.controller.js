import Order from "../../models/Order.js";
import Product from "../../models/product.model.js";
import sendEmail from "../../utils/sendEmail.js";
import Cart from "../../models/Cart.js";
import Coupon from "../../models/Coupon.js";
/* ============================
   Create Order
============================ */

export const createOrder = async (req, res) => {
  try {
    const {
      productId,
      userId,
      quantity,
      paymentMethod,
      shippingAddress,
    } = req.body;

    if (
      !productId ||
      !userId ||
      !quantity ||
      !paymentMethod ||
      !shippingAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }
    const price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    // Get Cart First
    const cart = await Cart.findOne({ userId });

    const subTotal = price * quantity;

    const tax = Number((subTotal * 0.18).toFixed(2));

    const discount = cart
      ? Number(cart.couponDiscount || 0)
      : 0;

    const totalAmount = subTotal + tax - discount;

    // Generate Order Number
    const lastOrder = await Order.findOne().sort({
      orderNumber: -1,
    });

    const orderNumber = lastOrder
      ? lastOrder.orderNumber + 1
      : 1001;

    console.log("Cart:", cart);

    // Check Coupon Before Creating Order
    let coupon = null;

    if (cart && cart.couponApplied) {
      coupon = await Coupon.findById(cart.couponApplied);

      console.log("Coupon:", coupon);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }

      console.log("Used By:", coupon.usedBy);
      console.log("Current User:", userId);

      const alreadyUsed = coupon.usedBy.some(
        (id) => id.toString() === userId.toString()
      );

      console.log("Already Used:", alreadyUsed);

      if (alreadyUsed) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
      }
    }

    // Create Order
    // Create Order
    const order = await Order.create({
      userId,
      orderNumber,

      products: [
        {
          productId: product._id,
          name: product.name,
          image: product.image || "",
          color: "",
          size: "",
          price,
          quantity,
          subtotal: subTotal,
        },
      ],

      paymentMethod,

      couponApplied: cart?.couponApplied || null,

      subTotal,
      discount,
      tax,
      shipping: 0,
      totalAmount,

      shippingAddress,
    });

    // Populate Order Data
    await order.populate("userId", "fullName email phone");
    await order.populate("products.productId", "name");

    // Update Product Stock
    product.stock -= quantity;
    await product.save();



    // Update Coupon After Successful Order
    if (cart && cart.couponApplied) {

      coupon = await Coupon.findById(cart.couponApplied);

      console.log("Coupon:", coupon);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }


      // Check coupon status
      if (coupon.status !== "Active") {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive",
        });
      }


      // Check coupon expiry
      if (new Date() > coupon.expirydate) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }


      console.log("Used By:", coupon.usedBy);
      console.log("Current User:", userId);


      // Check already used by user
      const alreadyUsed = Array.isArray(coupon.usedBy)
        ? coupon.usedBy.some(
          (id) => id.toString() === userId.toString()
        )
        : false;


      if (alreadyUsed) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
      }


      // Save coupon usage
      coupon.usedBy.push(userId);
      coupon.usedCount += 1;

      await coupon.save();


      console.log("Coupon usage updated");
    }


    //  ADDED - Send email to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: "🛒 New Order Received",
        html: `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    <h2 style="color:#16a34a;">🛒 New Order Received</h2>

    <p>
      <strong>Order Number:</strong>
      ${order.orderNumber}
    </p>

    <hr>

    <h3>👤 Customer Details</h3>

    <p><strong>Name:</strong>${order.userId.fullName}</p>
    <p><strong>Email:</strong> ${order.userId.email}</p>
    <p><strong>Phone:</strong> ${order.userId.phone}</p>

    <hr>

    <h3>📦 Product Details</h3>

<p><strong>Product:</strong> ${order.products[0].name}</p>
<p><strong>Quantity:</strong> ${order.products[0].quantity}</p>
    <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    <p><strong>Order Status:</strong> ${order.orderStatus}</p>

    <hr>

    <h3>🚚 Shipping Address</h3>

    <p><strong>Full Name:</strong> ${order.shippingAddress.fullName}</p>
    <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
    <p><strong>Address:</strong> ${order.shippingAddress.address}</p>
    <p><strong>City:</strong> ${order.shippingAddress.city}</p>
    <p><strong>State:</strong> ${order.shippingAddress.state}</p>
    <p><strong>Pincode:</strong> ${order.shippingAddress.pincode}</p>
    <p><strong>Country:</strong> ${order.shippingAddress.country}</p>

    <hr>

    <p style="color:#16a34a;font-weight:bold;">
      A new order has been placed. Please check the admin dashboard.
    </p>
  </div>
`
      });

      console.log("✅ Admin email sent successfully");
    } catch (err) {
      console.log("❌ Email Error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Get All Orders
============================ */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "products.productId",
        "name image price discountPrice brand category"
      )
      .populate(
        "userId",
        "fullName email phone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Get Single Order
============================ */

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId")
      .populate("userId")
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user.role !== "admin" && order.userId?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Update Order Status
============================ */

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be updated",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Update Payment Status
============================ */

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedPayment = [
      "Pending",
      "Paid",
      "Failed",
      "Refunded",
    ];

    if (!allowedPayment.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
      },
      {
        new: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Delete Order
============================ */

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   Order Dashboard Counts
============================ */

export const getOrderCounts = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders =
      await Order.countDocuments({
        orderStatus: "Pending",
      });

    const processingOrders =
      await Order.countDocuments({
        orderStatus: "Processing",
      });

    const shippedOrders =
      await Order.countDocuments({
        orderStatus: "Shipped",
      });

    const deliveredOrders =
      await Order.countDocuments({
        orderStatus: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        orderStatus: "Cancelled",
      });

    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue:
        revenue.length > 0
          ? revenue[0].totalRevenue
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Refund Requests
// ==============================

export const getRefundRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      refundRequested: true,
    })
      .populate("products.productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Request Refund
// ==============================

export const requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user.role !== "admin" && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be refunded",
      });
    }

    order.refundRequested = true;
    order.refundStatus = "Pending";
    order.refundReason = refundReason;
    order.refundDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund request submitted",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Approve Refund
// ==============================

export const approveRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.refundStatus = "Approved";
    order.paymentStatus = "Refunded";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund Approved",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Reject Refund
// ==============================

export const rejectRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.refundStatus = "Rejected";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund Rejected",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    })
      .populate("userId", "name email")
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



