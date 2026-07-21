import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartSummary.module.css';

const CartSummary = ({ cart, applyCoupon, removeCoupon }) => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    }
  };

  return (
    <div className={styles.cartSummaryContainer}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>
      
      <div className={styles.summaryRow}>
        <span>Subtotal ({cart.products.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
        <span>₹{cart.subtotal.toFixed(2)}</span>
      </div>
      
      {cart.discount > 0 && (
        <div className={styles.summaryRow}>
          <span>Product Discounts</span>
          <span className={styles.discountText}>-₹{cart.discount.toFixed(2)}</span>
        </div>
      )}
      
      {cart.offerDiscount > 0 && (
        <div className={styles.summaryRow}>
          <span>Offer Discount</span>
          <span className={styles.discountText}>-₹{cart.offerDiscount.toFixed(2)}</span>
        </div>
      )}

      {cart.couponApplied ? (
        <div className={styles.activeCoupon}>
          <div>
            Coupon Applied: <span>{cart.couponApplied.code || 'Yes'}</span>
            {cart.couponDiscount > 0 && <div className={styles.discountText}>-${cart.couponDiscount.toFixed(2)}</div>}
          </div>
          <button className={styles.removeCouponBtn} onClick={removeCoupon}>Remove</button>
        </div>
      ) : (
        <div className={styles.couponContainer}>
          <span style={{fontSize: '0.9rem', color: '#666'}}>Have a coupon code?</span>
          <form className={styles.couponInputGroup} onSubmit={handleApplyCoupon}>
            <input 
              type="text" 
              className={styles.couponInput} 
              placeholder="Enter Code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="submit" className={styles.couponBtn}>Apply</button>
          </form>
        </div>
      )}

      <div className={styles.summaryRow} style={{marginTop: '1.5rem'}}>
        <span>Shipping</span>
        <span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</span>
      </div>
      
      <div className={styles.summaryRow}>
        <span>Estimated GST (18%)</span>
        <span>${cart.tax.toFixed(2)}</span>
      </div>

      <div className={`${styles.summaryRow} ${styles.total}`}>
        <span>Total</span>
        <span>₹{cart.finalTotal.toFixed(2)}</span>
      </div>

      <button 
        className={styles.checkoutBtn} 
        onClick={() => router.push('/checkout')}
        disabled={cart.products.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
