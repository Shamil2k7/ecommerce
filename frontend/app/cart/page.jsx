"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem/CartItem";
import CartSummary from "../../components/cart/CartSummary/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart/EmptyCart";
import LoadingSpinner from "../../components/cart/LoadingSpinner/LoadingSpinner";
import styles from "./Cart.module.css";

export default function CartPage() {
  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (loading && !cart) {
    return <LoadingSpinner />;
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <div>
          <h1 className={styles.cartTitle}>Shopping Cart</h1>
          <p className={styles.cartSubtitle}>
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        {/*
        <button
          onClick={clearCart}
          className={styles.clearCartBtn}
        >
          Clear Cart
        </button>
        */}
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItemsList}>
          {cart.products.map((item, index) => (
            <CartItem
              key={`${item.productId}-${item.color}-${item.size}-${index}`}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>

        <CartSummary cart={cart} />
      </div>
    </div>
  );
}