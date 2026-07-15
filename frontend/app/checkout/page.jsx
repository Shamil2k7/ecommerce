"use client";

import { useState } from "react";
import styles from "./Checkout.module.css";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("Cash on Delivery");

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

          <div className={styles.product}>
            <span>iPhone 15 × 1</span>
            <span>₹79,999</span>
          </div>

          <div className={styles.product}>
            <span>AirPods × 1</span>
            <span>₹19,999</span>
          </div>

          <hr />

          <div className={styles.row}>
            <span>Subtotal</span>
            <span>₹99,998</span>
          </div>

          <div className={styles.row}>
            <span>Discount</span>
            <span>-₹2,000</span>
          </div>

          <div className={styles.row}>
            <span>Tax</span>
            <span>₹1,800</span>
          </div>

          <div className={styles.row}>
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <span>₹99,798</span>
          </div>

          <button className={styles.button}>
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
}