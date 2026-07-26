"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Banners.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/marketing/banners`);
      if (res.data.success) {
        setBanners(res.data.banners || []);
      }
    } catch (error) {
      console.error("Get Banners Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Delete Banner?",
      text: "Are you sure you want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axios.delete(`${API}/api/marketing/banners/${id}`, {
        withCredentials: true,
      });

      // Remove deleted banner from state
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
      toast.success("Banner deleted successfully!");
    } catch (error) {
      console.error("Delete Banner Error:", error);
      toast.error("Failed to delete banner.");
    }
  };

  return (
    <section className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Banners</h1>
          <p>Manage homepage banners</p>
        </div>

        <Link href="/admin/banners/add" className={styles.addBtn}>
          <Plus size={18} />
          Add Banner
        </Link>
      </div>

      {/* Table */}
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Banner</th>
              <th>Display Order</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading banners...
                </td>
              </tr>
            ) : banners.length > 0 ? (
              banners.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.image}
                      alt={`Banner ${index + 1}`}
                      className={styles.image}
                    />
                  </td>

                  <td>Banner {index + 1}</td>

                  <td>{item.displayOrder}</td>

                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Active"
                          ? styles.active
                          : styles.inactive
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/banners/edit/${item._id}`}
                        className={styles.actionBtn}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => handleDelete(item._id)}
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
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}