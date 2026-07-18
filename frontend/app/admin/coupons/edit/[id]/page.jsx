"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "../../add/AddCoupon.module.css";

export default function EditCouponPage() {
  const { id } = useParams();
  const router = useRouter();

  const [coupon, setCoupon] = useState({
    name: "",
    code: "",
    discount: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    expirydate: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    discount: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    expirydate: "",
  });

  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/coupons/${id}`
      );

      setCoupon({
        ...res.data,
        expirydate: res.data.expirydate?.split("T")[0],
      });
    } catch (error) {
      console.log(error);
    }
  };
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
      newErrors.minimumOrderAmount =
        "Minimum Order Amount is required";
    } else if (Number(coupon.minimumOrderAmount) < 0) {
      newErrors.minimumOrderAmount =
        "Minimum Order Amount cannot be negative";
    }

    if (!coupon.maximumDiscount) {
      newErrors.maximumDiscount =
        "Maximum Discount is required";
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
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/coupons/${id}`,
        coupon
      );

      alert("Coupon Updated Successfully");

      router.push("/admin/coupons");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Update Failed"
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

          <h1>Edit Coupon</h1>
          <p>Update coupon information</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <input
            type="text"
            name="name"
            value={coupon.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />

          {errors.name && (
            <p className={styles.error}>{errors.name}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Coupon Code</label>
          <input
            type="text"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            className={errors.code ? styles.errorInput : ""}
          />

          {errors.code && (
            <p className={styles.error}>{errors.code}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={coupon.discount}
            onChange={handleChange}
            className={errors.discount ? styles.errorInput : ""}
          />

          {errors.discount && (
            <p className={styles.error}>{errors.discount}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Minimum Order Amount</label>
          <input
            type="number"
            name="minimumOrderAmount"
            value={coupon.minimumOrderAmount}
            onChange={handleChange}
            className={errors.minimumOrderAmount ? styles.errorInput : ""}
          />

          {errors.minimumOrderAmount && (
            <p className={styles.error}>
              {errors.minimumOrderAmount}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>Maximum Discount</label>
          <input
            type="number"
            name="maximumDiscount"
            value={coupon.maximumDiscount}
            onChange={handleChange}
            className={errors.maximumDiscount ? styles.errorInput : ""}
          />

          {errors.maximumDiscount && (
            <p className={styles.error}>
              {errors.maximumDiscount}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={coupon.usageLimit}
            onChange={handleChange}
            className={errors.usageLimit ? styles.errorInput : ""}
          />

          {errors.usageLimit && (
            <p className={styles.error}>
              {errors.usageLimit}
            </p>
          )}
        </div>

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
            <p className={styles.error}>
              {errors.expirydate}
            </p>
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

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => router.push("/admin/coupons")}
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={handleUpdate}
          >
            Update Coupon
          </button>
        </div>
      </div>
    </section>
  );
}