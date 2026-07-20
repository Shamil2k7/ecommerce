"use client";

import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem/CartItem';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import EmptyCart from '../../components/cart/EmptyCart/EmptyCart';
import LoadingSpinner from '../../components/cart/LoadingSpinner/LoadingSpinner';
import styles from './cart.module.css';

export default function CartPage() {
  const { 
    cart, 
    loading, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    applyCoupon, 
    removeCoupon 
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.cartTitle}>Your Shopping Cart</h1>
        <button 
          onClick={clearCart} 
          style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}
        >
          Clear Cart
        </button>
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
        
        <CartSummary 
          cart={cart}
          applyCoupon={applyCoupon}
          removeCoupon={removeCoupon}
        />
      </div>
    </div>
  );
}