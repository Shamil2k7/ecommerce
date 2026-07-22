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

  const [errors, setErrors] = useState({
    name: "",
    code: "",
    discount: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    expirydate: "",
    usageLimit: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!coupon.name.trim()) {
      newErrors.name = "Coupon Name is required";
    }

    if (!coupon.code.trim()) {
      newErrors.code = "Coupon Code is required";
    }

    if (!coupon.discount) {
      newErrors.discount = "Discount is required";
    } else if (
      Number(coupon.discount) <= 0 ||
      Number(coupon.discount) > 100
    ) {
      newErrors.discount = "Discount must be between 1 and 100";
    }

    if (!coupon.minimumOrderAmount) {
      newErrors.minimumOrderAmount = "Minimum Order Amount is required";
    } else if (Number(coupon.minimumOrderAmount) < 0) {
      newErrors.minimumOrderAmount =
        "Minimum Order Amount cannot be negative";
    }

    if (!coupon.maximumDiscount) {
      newErrors.maximumDiscount = "Maximum Discount is required";
    } else if (Number(coupon.maximumDiscount) < 0) {
      newErrors.maximumDiscount =
        "Maximum Discount cannot be negative";
    }

    if (!coupon.expirydate) {
      newErrors.expirydate = "Expiry Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(coupon.expirydate);

      if (expiry < today) {
        newErrors.expirydate =
          "Expiry Date cannot be in the past";
      }
    }

    if (!coupon.usageLimit) {
      newErrors.usageLimit = "Usage Limit is required";
    } else if (Number(coupon.usageLimit) <= 0) {
      newErrors.usageLimit =
        "Usage Limit must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCoupon((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${BASE_URL}/api/marketing/coupons`,
        coupon,
        {
          withCredentials: true,
        }
      );

      alert(res.data.message || "Coupon Added Successfully");

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

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to add coupon"
      );
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
              className={errors.name ? styles.errorInput : ""}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.field}>
            <label>Coupon Code</label>
            <input
              type="text"
              name="code"
              value={coupon.code}
              onChange={handleChange}
              placeholder="WELCOME10"
              className={errors.code ? styles.errorInput : ""}
            />
            {errors.code && <p className={styles.error}>{errors.code}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                min="1"
                max="100"
                value={coupon.discount}
                onChange={handleChange}
                placeholder="10"
                className={errors.discount ? styles.errorInput : ""}
              />
              {errors.discount && (
                <p className={styles.error}>{errors.discount}</p>
              )}
            </div>

            <div className={styles.field}>
              <label>Maximum Discount (₹)</label>
              <input
                type="number"
                name="maximumDiscount"
                min="0"
                value={coupon.maximumDiscount}
                onChange={handleChange}
                placeholder="500"
                className={errors.maximumDiscount ? styles.errorInput : ""}
              />
              {errors.maximumDiscount && (
                <p className={styles.error}>{errors.maximumDiscount}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label>Minimum Order Amount (₹)</label>
            <input
              type="number"
              name="minimumOrderAmount"
              min="0"
              value={coupon.minimumOrderAmount}
              onChange={handleChange}
              placeholder="1000"
              className={errors.minimumOrderAmount ? styles.errorInput : ""}
            />
            {errors.minimumOrderAmount && (
              <p className={styles.error}>
                {errors.minimumOrderAmount}
              </p>
            )}
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
                className={errors.expirydate ? styles.errorInput : ""}
              />
              {errors.expirydate && (
                <p className={styles.error}>{errors.expirydate}</p>
              )}
            </div>

            <div className={styles.field}>
              <label>Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                min="1"
                value={coupon.usageLimit}
                onChange={handleChange}
                placeholder="100"
                className={errors.usageLimit ? styles.errorInput : ""}
              />
              {errors.usageLimit && (
                <p className={styles.error}>{errors.usageLimit}</p>
              )}
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