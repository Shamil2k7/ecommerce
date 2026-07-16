import Order from "../../models/Order.js";
import Product from "../../models/product.model.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      productId,
      userId,
      quantity,
      paymentMethod,
      shippingAddress,
    } = req.body;

    // Validate required fields
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

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check Stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Price Calculation
    const price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    const subTotal = price * quantity;

    const tax = Number((subTotal * 0.18).toFixed(2)); // 18%

    const discount = 0;

    const totalAmount = subTotal + tax - discount;

    // Generate Order Number
    const orderNumber = Date.now();

    // Create Order
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

    // Reduce Stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};