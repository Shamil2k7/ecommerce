"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./AddCoupon.module.css";

export default function AddCouponPage() {
  const router = useRouter();

  const [coupon, setCoupon] = useState({
    name: "",
    code: "",
    discount: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    expirydate: "",
    usageLimit: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setCoupon({
      ...coupon,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await axios.post(
        `${BASE_URL}/api/marketing/coupons`,
        coupon
      );

      // Display success message from backend
      alert(res.data);

      setCoupon({
        name: "",
        code: "",
        discount: "",
        minimumOrderAmount: "",
        maximumDiscount: "",
        expirydate: "",
        usageLimit: "",
        status: "Active",
      });

      router.push("/admin/coupons");
    } catch (error) {
      console.log(error);
      // Display the actual error message sent from the backend (like "All fields are required" or "Coupon Already Exists")
      const errorMessage = error.response?.data || "Failed to add coupon";
      alert(errorMessage);
    }
  };

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

      <form className={styles.grid} onSubmit={handleSubmit}>
        {/* Left */}
        <div className={styles.card}>
          <h3>Coupon Details</h3>

          <div className={styles.field}>
            <label>Coupon Name</label>
            <input
              type="text"
              name="name"
              value={coupon.name}
              onChange={handleChange}
              placeholder="New User Offer"
            />
          </div>

          <div className={styles.field}>
            <label>Coupon Code</label>
            <input
              type="text"
              name="code"
              value={coupon.code}
              onChange={handleChange}
              placeholder="WELCOME10"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={coupon.discount}
                onChange={handleChange}
                placeholder="10"
              />
            </div>

            <div className={styles.field}>
              <label>Maximum Discount</label>
              <input
                type="number"
                name="maximumDiscount"
                value={coupon.maximumDiscount}
                onChange={handleChange}
                placeholder="500"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Minimum Order Amount</label>
            <input
              type="number"
              name="minimumOrderAmount"
              value={coupon.minimumOrderAmount}
              onChange={handleChange}
              placeholder="1000"
            />
          </div>
        </div>

        {/* Right */}
        <div>
          <div className={styles.card}>
            <h3>Coupon Settings</h3>

            <div className={styles.field}>
              <label>Expiry Date</label>
              <input
                type="date"
                name="expirydate"
                value={coupon.expirydate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={coupon.usageLimit}
                onChange={handleChange}
                placeholder="100"
              />
            </div>

            <div className={styles.field}>
              <label>Status</label>
              <select
                name="status"
                value={coupon.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push("/admin/coupons")}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveBtn}>
              Save Coupon
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}