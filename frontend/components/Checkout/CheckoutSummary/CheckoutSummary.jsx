import { useState } from "react";
import styles from "./CheckoutSummary.module.css";

export default function CheckoutSummary({
  cart,
  selectedAddress,
  handlePlaceOrder,
  applyCoupon,
  removeCoupon,
}) {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    }
  };

  if (!cart) return null;

  return (
    <aside className={styles.checkoutSidebar}>
      <div className={styles.orderSummaryCard}>
        <h2>Order Summary</h2>

        <div className={styles.orderItems}>
          {cart.products?.map((product) => (
            <div
              key={`${product.productId}-${product.color}-${product.size}`}
              className={styles.orderItem}
            >
              <div className={styles.orderItemInfo}>
                <span className={styles.orderItemName}>{product.name}</span>
                <span className={styles.orderItemMeta}>
                  Qty: {product.quantity}
                </span>
              </div>

              <span className={styles.orderItemPrice}>
                ₹{(product.price * product.quantity)?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>








        <div className={styles.sectionDivider}></div>

        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <span>₹{cart.subtotal?.toLocaleString()}</span>
        </div>

        {cart.discount > 0 && (
          <div className={`${styles.priceRow} ${styles.discountRow}`}>
            <span>Discount</span>
            <span>-₹{cart.discount?.toLocaleString()}</span>
          </div>
        )}

        {cart.tax > 0 && (
          <div className={styles.priceRow}>
            <span>Tax</span>
            <span>₹{cart.tax?.toLocaleString()}</span>
          </div>
        )}

        <div className={styles.priceRow}>
          <span>Shipping</span>
          <span>
            {cart.shipping === 0
              ? "Free"
              : `₹${cart.shipping?.toLocaleString()}`}
          </span>
        </div>

        <div className={styles.sectionDivider}></div>



        {cart.couponApplied ? (
          <div className={styles.activeCoupon}>
            <div>
              Coupon Applied: <span>{cart.couponApplied.code || 'Yes'}</span>
              {cart.couponDiscount > 0 && <div className={styles.discountRow}>-₹{cart.couponDiscount.toLocaleString()}</div>}
            </div>
            <button className={styles.removeCouponBtn} onClick={removeCoupon}>Remove</button>
          </div>
        ) : (
          <div className={styles.couponContainer}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Have a coupon code?</span>
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






        <div className={styles.sectionDivider}></div>

        <div className={styles.grandTotalRow}>
          <span>Total Amount</span>
          <span className={styles.grandTotalPrice}>
            ₹{cart.finalTotal?.toLocaleString()}
          </span>
        </div>

        <button
          className={styles.checkoutButton}
          onClick={handlePlaceOrder}
          disabled={!selectedAddress}
        >
          {selectedAddress
            ? `Pay ₹${cart.finalTotal?.toLocaleString()}`
            : "Select Address to Continue"}
        </button>

        <p className={styles.checkoutSecurity}>
          🔒 Secure Checkout
        </p>
      </div>
    </aside>
  );
}