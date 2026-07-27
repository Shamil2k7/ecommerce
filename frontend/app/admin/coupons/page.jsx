"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import styles from "./Coupons.module.css";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/marketing/coupons`,
        {
          withCredentials: true,
        }
      );

      console.log("Coupon Response:", res.data);

      if (Array.isArray(res.data)) {
        setCoupons(res.data);
      } else if (Array.isArray(res.data.coupons)) {
        setCoupons(res.data.coupons);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: "Are you sure you want to delete this coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${API}/api/marketing/coupons/${id}`,
        {
          withCredentials: true,
        }
      );

      setCoupons((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Coupon deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const filteredCoupons = coupons.filter((item) =>
    item.code?.toLowerCase().includes(search.toLowerCase())
  );

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
              <th>Discount</th>
              <th>Minimum Order</th>
              <th>Maximum Discount</th>
              <th>Total Usage</th>
              <th>Balance Usage</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : filteredCoupons.length > 0 ? (
              filteredCoupons.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span className={styles.code}>
                      {item.code}
                    </span>
                  </td>

                  <td>{item.discount}%</td>

                  <td>
                    ₹{item.minimumOrderAmount}
                  </td>

                  <td>
                    ₹{item.maximumDiscount}
                  </td>

                  <td>
                    {item.usageLimit > 0
                      ? item.usageLimit
                      : "Unlimited"}
                  </td>

                  <td>
                    {item.usageLimit > 0
                      ? Math.max(
                          item.usageLimit -
                            (item.usedCount || 0),
                          0
                        )
                      : "Unlimited"}
                  </td>

                  <td>
                    {item.expirydate
                      ? new Date(
                          item.expirydate
                        ).toLocaleDateString("en-GB")
                      : "-"}
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

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No Coupons Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}