"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./AddCoupon.module.css";

export default function AddCouponPage() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/coupons" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Coupons
          </Link>

          <h1>Add Coupon</h1>
          <p>Create a new discount coupon</p>
        </div>
      </div>

      <form className={styles.grid}>
        {/* Left Side */}
        <div className={styles.card}>
          <h3>Coupon Details</h3>

          <div className={styles.field}>
            <label>Coupon Code</label>
            <input
              type="text"
              placeholder="WELCOME10"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Discount Type</label>

              <select>
                <option>Percentage</option>
                <option>Fixed Amount</option>
                <option>Free Shipping</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Discount Value</label>
              <input
                type="number"
                placeholder="10"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Minimum Order</label>
              <input
                type="number"
                placeholder="100"
              />
            </div>

            <div className={styles.field}>
              <label>Maximum Discount</label>
              <input
                type="number"
                placeholder="500"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Coupon description..."
            />
          </div>
        </div>

        {/* Right Side */}
        <div>
          <div className={styles.card}>
            <h3>Coupon Settings</h3>

            <div className={styles.field}>
              <label>Expiry Date</label>
              <input type="date" />
            </div>

            <div className={styles.field}>
              <label>Usage Limit</label>
              <input
                type="number"
                placeholder="100"
              />
            </div>

            <div className={styles.field}>
              <label>Status</label>

              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Save Coupon
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}