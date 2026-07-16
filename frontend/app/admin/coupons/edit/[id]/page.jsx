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

  const handleChange = (e) => {
    setCoupon({
      ...coupon,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/coupons/${id}`,
        coupon
      );

      alert("Coupon Updated Successfully");
      router.push("/admin/coupons");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
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
          <label>Coupon Name</label>
          <input
            type="text"
            name="name"
            value={coupon.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Coupon Code</label>
          <input
            type="text"
            name="code"
            value={coupon.code}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={coupon.discount}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Minimum Order Amount</label>
          <input
            type="number"
            name="minimumOrderAmount"
            value={coupon.minimumOrderAmount}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Maximum Discount</label>
          <input
            type="number"
            name="maximumDiscount"
            value={coupon.maximumDiscount}
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
          />
        </div>

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