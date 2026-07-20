"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import styles from "./Checkout.module.css";
import Link from "next/link";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("Cash on Delivery");
  const { cart } = useCart();

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/shop" style={{ marginTop: "20px", display: "inline-block", padding: "10px 20px", background: "var(--primary)", color: "white", borderRadius: "5px", textDecoration: "none" }}>
            Go to Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className={styles.grid}>
        {/* Billing */}

        <div className={styles.card}>
          <h2>Billing Details</h2>

          <div className={styles.form}>
            <input placeholder="Full Name" />
            <input placeholder="Email Address" />
            <input placeholder="Phone Number" />
            <textarea placeholder="Address" rows={4} />
            <input placeholder="City" />
            <input placeholder="State" />
            <input placeholder="Pincode" />
            <input placeholder="Country" />
            <input placeholder="Coupons" />
          </div>

          <h2>Payment Method</h2>

          <div className={styles.payment}>
            {[
              "Cash on Delivery",
              "UPI",
              "Credit Card",
              "Debit Card",
              "Net Banking",
            ].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === item}
                  onChange={() => setPayment(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}

        <div className={styles.summary}>
          <h2>Order Summary</h2>

          {cart.products.map((product) => (
            <div key={`${product.productId}-${product.color}-${product.size}`} className={styles.product}>
              <span>{product.name} × {product.quantity}</span>
              <span>₹{product.price?.toLocaleString()}</span>
            </div>
          ))}

          <hr />

          <div className={styles.row}>
            <span>Subtotal</span>
            <span>₹{cart.subtotal?.toLocaleString()}</span>
          </div>

          <div className={styles.row}>
            <span>Discount</span>
            <span>-₹{cart.discount?.toLocaleString() || 0}</span>
          </div>

          <div className={styles.row}>
            <span>Tax</span>
            <span>₹{cart.tax?.toLocaleString() || 0}</span>
          </div>

          <div className={styles.row}>
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? "Free" : `₹${cart.shipping?.toLocaleString()}`}</span>
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <span>₹{cart.finalTotal?.toLocaleString()}</span>
          </div>

          <button className={styles.button}>
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
}