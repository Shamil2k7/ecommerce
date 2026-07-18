import Order from "../../models/Order.js";
import Product from "../../models/product.model.js";

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

    const subTotal = price * quantity;

    const tax = Number((subTotal * 0.18).toFixed(2));

    const discount = 0;

    const totalAmount = subTotal + tax - discount;

    // Generate Order Number
    const lastOrder = await Order.findOne().sort({
      orderNumber: -1,
    });

    const orderNumber = lastOrder
      ? lastOrder.orderNumber + 1
      : 1001;

    const order = await Order.create({
      productId,
      userId,
      orderNumber,
      quantity,
      paymentMethod,
      subTotal,
      discount,
      tax,
      totalAmount,
      shippingAddress,
    });

    product.stock -= quantity;
    await product.save();

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
        "productId",
        "name image price discountPrice brand category"
      )
      .populate(
        "userId",
        "name email phone"
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
      .populate("productId")
      .populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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
      .populate("productId")
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