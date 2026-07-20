import Cart from "../../models/Cart.js";
import Product from "../../models/product.model.js";
import Coupon from "../../models/Coupon.js";
import { calculateCartTotals } from "../../utils/cartCalculations.js";

const getCartByUser = async (userId) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      products: [],
    });
  }

  return cart;
};

// Recalculate cart totals
const updateCartTotals = async (cart) => {
  // Populate coupon safely
  if (cart.couponApplied) {
    await cart.populate("couponApplied");
  }

  // Populate offer only if one is actually stored
  if (cart.offerApplied) {
    try {
      await cart.populate("offerApplied");
    } catch (err) {
      console.log("Offer model not found, skipping populate.");
      cart.offerApplied = null;
    }
  }

  const totals = calculateCartTotals(
    cart,
    cart.couponApplied || null,
    cart.offerApplied || null
  );

  cart.subtotal = totals.subtotal;
  cart.discount = totals.discount;
  cart.offerDiscount = totals.offerDiscount;
  cart.couponDiscount = totals.couponDiscount;
  cart.shipping = totals.shipping;
  cart.tax = totals.tax;
  cart.finalTotal = totals.finalTotal;

  await cart.save();

  return cart;
};

// Get Cart

export const getCart = async (req, res) => {
  try {
    const cart = await getCartByUser(req.params.userId);

    await updateCartTotals(cart);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Add To Cart
export const addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity = 1,
      color = "",
      size = "",
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const cart = await getCartByUser(userId);

    const existingItem = cart.products.find(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    const sellingPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.products.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "",
        color,
        size,
        price: sellingPrice,
        originalPrice: product.price,
        quantity: Number(quantity),
        stock: product.stock || 0,
      });
    }

    await updateCartTotals(cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Quantity Update 

export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, color, size, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    const item = cart.products.find(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    item.quantity = Number(quantity);
    item.subtotal = item.quantity * item.price;

    await updateCartTotals(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to update quantity.",
    });
  }
};



// Remove Item

export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { color, size } = req.query;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    cart.products = cart.products.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
        )
    );

    await updateCartTotals(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to remove item.",
    });
  }
};



// for Clear Cart 

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { products: [] },
      });
    }

    cart.products = [];
    cart.couponApplied = null;

    await updateCartTotals(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to clear cart.",
    });
  }
};



// Apply Coupon 

export const applyCoupon = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty.",
      });
    }

    if (!code) {
      cart.couponApplied = null;

      await updateCartTotals(cart);

      return res.status(200).json({
        success: true,
        message: "Coupon removed.",
        cart,
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon.",
      });
    }

    if (coupon.status !== "Active") {
      return res.status(400).json({
        message: "Coupon is inactive.",
      });
    }

    if (new Date(coupon.expirydate) < new Date()) {
      return res.status(400).json({
        message: "Coupon has expired.",
      });
    }

    cart.couponApplied = coupon._id;

    await updateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to apply coupon.",
    });
  }
};