// import Order from "../models/orderModel.js";
// import Product from "../models/productModel.js";
// import User from "../models/userModel.js";

// // Add Order
// export const addOrder = async (req, res) => {
//   try {
//     const {
//       productId,
//       userId,
//       quantity,
//       paymentMethod,
//       discount,
//       tax,
//       shippingAddress,
//     } = req.body;

//     // Check required fields
//     if (
//       !productId ||
//       !userId ||
//       !quantity ||
//       !paymentMethod ||
//       !shippingAddress
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields are mandatory.",
//       });
//     }

//     // Check Product
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found.",
//       });
//     }

//     // Check User
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Calculate Price
//     const subTotal = product.price * quantity;
//     const finalDiscount = discount || 0;
//     const finalTax = tax || 0;
//     const totalAmount = subTotal - finalDiscount + finalTax;

//     // Generate Order Number
//     const lastOrder = await Order.findOne().sort({ orderNumber: -1 });

//     const orderNumber = lastOrder
//       ? lastOrder.orderNumber + 1
//       : 100001;

//     // Save Order
//     const order = new Order({
//       productId,
//       userId,
//       orderNumber,
//       quantity,
//       paymentMethod,
//       subTotal,
//       discount: finalDiscount,
//       tax: finalTax,
//       totalAmount,
//       shippingAddress,
//     });

//     await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully.",
//       order,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to place order.",
//       error: error.message,
//     });
//   }
// };
    