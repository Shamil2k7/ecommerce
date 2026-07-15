"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import styles from "./Coupons.module.css";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Get all coupons
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/coupons`
      );

      console.log("Coupons:", response.data);

      setCoupons(response.data);
    } catch (error) {
      console.log("Fetch coupon error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Delete coupon
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this coupon?"
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/coupons/${id}`
    );

    console.log(res.data);

    // Reload coupons after delete
    fetchCoupons();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};
  // Search
  const filteredCoupons = coupons.filter((item) =>
    item.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <section className={styles.container}>
        <h2>Loading Coupons...</h2>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Coupons</h1>
          <p>Manage discount coupons</p>
        </div>

        <Link
          href="/admin/coupons/add"
          className={styles.addBtn}
        >
          <Plus size={18} />
          Add Coupon
        </Link>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search coupon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Minimum Order</th>
              <th>Maximum Discount</th>
              <th>Usage Limit</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span className={styles.code}>
                      {item.code}
                    </span>
                  </td>

                  <td>Percentage</td>

                  <td>{item.discount}%</td>

                  <td>₹{item.minimumOrderAmount}</td>

                  <td>₹{item.maximumDiscount}</td>

                  <td>{item.usageLimit}</td>

                  <td>
                    {new Date(item.expirydate).toLocaleDateString("en-GB")}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Active"
                          ? styles.active
                          : styles.expired
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/coupons/edit/${item._id}`}
                        className={styles.actionBtn}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button onClick={() => handleDelete(item._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Coupons Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>

   );
}