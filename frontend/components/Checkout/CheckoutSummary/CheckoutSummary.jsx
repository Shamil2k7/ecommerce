import { useState } from "react";
import styles from "./CheckoutSummary.module.css";
import { FiLock } from "react-icons/fi";

export default function CheckoutSummary({
  cart,
  selectedAddress,
  handlePlaceOrder,
  applyCoupon,
  removeCoupon,
}) {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();

    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode("");
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
                <span className={styles.orderItemName}>
                  {product.name}
                </span>

                <span className={styles.orderItemMeta}>
                  Qty: {product.quantity}
                  {product.color && ` • ${product.color}`}
                  {product.size && ` • ${product.size}`}
                </span>
              </div>

              <span className={styles.orderItemPrice}>
                ₹{(product.price * product.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>


        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <span>₹{cart.subtotal?.toLocaleString()}</span>
        </div>

        {cart.discount > 0 && (
          <div className={`${styles.priceRow} ${styles.discountRow}`}>
            <span>Discount</span>
            <span>-₹{cart.discount.toLocaleString()}</span>
          </div>
        )}

        {cart.tax > 0 && (
          <div className={styles.priceRow}>
            <span>Tax</span>
            <span>₹{cart.tax.toLocaleString()}</span>
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

       
       

        {cart.couponApplied ? (
          <div className={styles.activeCouponTicket}>
            <div className={styles.ticketSuccessLeft}>
              <span className={styles.ticketAppliedLabel}>
                 COUPON APPLIED
              </span>

              <h3 className={styles.ticketCouponCode}>
                {cart.couponApplied.code || "DISCOUNT"}
              </h3>

              {cart.couponDiscount > 0 && (
                <p className={styles.ticketSavings}>
                  You Saved ₹
                  {cart.couponDiscount.toLocaleString()}
                </p>
              )}
            </div>

            <button
              type="button"
              className={styles.removeTicketButton}
              onClick={removeCoupon}
            >
              REMOVE
            </button>
          </div>
        ) : (
          <form
            className={styles.couponTicket}
            onSubmit={handleApplyCoupon}
          >
            <div className={styles.ticketLeft}>
              <span className={styles.ticketLabel}>
                SPECIAL COUPON
              </span>

              <input
                type="text"
                className={styles.ticketInput}
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.ticketButton}
            >
              APPLY
            </button>
          </form>
        )}


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
          <FiLock className={styles.securityIcon} />
          <span>Secure Checkout</span>
        </p>
      </div>
    </aside>
  );
}