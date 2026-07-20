"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper for API calls
  const executeRequest = async (request, errorMessage) => {
    try {
      setLoading(true);
      return await request();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get user's cart
  const fetchCart = useCallback(async () => {
    if (!user?._id) return;

    const data = await executeRequest(
      () => cartService.getCart(user._id),
      "Failed to fetch cart"
    );

    if (data) {
      setCart(data.cart || data);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item
  const addToCart = async (product) => {
    if (!user?._id) {
      alert("Please login first");
      return;
    }

    const data = await executeRequest(
      () =>
        cartService.addToCart({
          ...product,
          userId: user._id,
        }),
      "Failed to add item"
    );

    if (data) {
      setCart(data.cart || data);
      alert(data.message || "Product added to cart");
    }
  };

  // Update quantity
  const updateQuantity = async (
    productId,
    quantity,
    color = "",
    size = ""
  ) => {
    if (!user?._id) return;

    const data = await executeRequest(
      () =>
        cartService.updateQuantity({
          userId: user._id,
          productId,
          quantity,
          color,
          size,
        }),
      "Failed to update quantity"
    );

    if (data) {
      setCart(data.cart || data);
    }
  };

  // Remove item
  const removeItem = async (productId, color = "", size = "") => {
    if (!user?._id) return;

    const data = await executeRequest(
      () =>
        cartService.removeItem(
          user._id,
          productId,
          color,
          size
        ),
      "Failed to remove item"
    );

    if (data) {
      setCart(data.cart || data);
      alert(data.message || "Item removed");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user?._id) return;

    const data = await executeRequest(
      () => cartService.clearCart(user._id),
      "Failed to clear cart"
    );

    if (data) {
      setCart(data.cart || data);
      alert(data.message || "Cart cleared");
    }
  };

  // Apply coupon
  const applyCoupon = async (code) => {
    if (!user?._id) return;

    const data = await executeRequest(
      () =>
        cartService.applyCoupon({
          userId: user._id,
          code,
        }),
      "Failed to apply coupon"
    );

    if (data) {
      setCart(data.cart);
      alert(data.message);
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    if (!user?._id) return;

    const data = await executeRequest(
      () =>
        cartService.applyCoupon({
          userId: user._id,
          code: "",
        }),
      "Failed to remove coupon"
    );

    if (data) {
      setCart(data.cart || data);
      alert(data.message || "Coupon removed");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};