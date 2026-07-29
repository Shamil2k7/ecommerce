"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
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

      toast.error(error.response?.data?.message || errorMessage, {
        position: "top-center",
        autoClose: 2500,
      });

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
      toast.warning("Please login first", {
        position: "top-center",
        autoClose: 2500,
      });
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

      toast.success(data.message || "Product added to cart", {
        position: "top-center",
        autoClose: 2000,
      });
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

      toast.success(data.message, {
        position: "top-center",
        autoClose: 2000,
      });
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

      toast.success(data.message || "Coupon removed", {
        position: "top-center",
        autoClose: 2000,
      });
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