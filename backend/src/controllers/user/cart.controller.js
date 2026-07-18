import Cart from "../../models/Cart.js";
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
  await cart.populate("couponApplied");
  await cart.populate("offerApplied");

  const totals = calculateCartTotals(
    cart,
    cart.couponApplied,
    cart.offerApplied
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

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load cart." });
  }
};



// Add To Cart

export const addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      name,
      image,
      color,
      size,
      price,
      originalPrice,
      quantity,
      stock,
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "User and Product are required.",
      });
    }

    const cart = await getCartByUser(userId);

    const item = cart.products.find(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size
    );

    if (item) {
      item.quantity += Number(quantity || 1);
      item.subtotal = item.quantity * item.price;
    } else {
      cart.products.push({
        productId,
        name,
        image,
        color,
        size,
        price,
        originalPrice: originalPrice || price,
        quantity: quantity || 1,
        stock: stock || 10,
        subtotal: price * (quantity || 1),
      });
    }

    await updateCartTotals(cart);

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to add product.",
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

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
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

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
      return res.json({
        products: [],
      });
    }

    cart.products = [];
    cart.couponApplied = null;

    await updateCartTotals(cart);

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
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

      return res.json({
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

    res.json({
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