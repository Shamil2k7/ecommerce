import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartSummary.module.css';

const CartSummary = ({ cart }) => {
  const router = useRouter();

  return (
    <div className={styles.cartSummaryContainer}>
      <h3 className={styles.summaryTitle}>Price Details</h3>
      
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
