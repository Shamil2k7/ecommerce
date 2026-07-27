"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import styles from "./Banners.module.css";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

const getBanners = async () => {
  try {
    const res = await axios.get(
      `${API}/api/marketing/banners`,
      {
        withCredentials: true,
      }
    );

    setBanners(res.data.banners || []);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load banners");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getBanners();
}, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Banner?",
      text: "Are you sure you want to delete this banner?",
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
        `${API}/api/marketing/banners/${id}`,
        {
          withCredentials: true,
        }
      );

      setBanners((prev) =>
        prev.filter((banner) => banner._id !== id)
      );

      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Banners</h1>
          <p>Manage homepage banners</p>
        </div>

        <Link
          href="/admin/banners/add"
          className={styles.addBtn}
        >
          <Plus size={18} />
          Add Banner
        </Link>
      </div>

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
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No banners found
                </td>
              </tr>
            ) : (
              banners.map((banner, index) => (
                <tr key={banner._id}>
                  <td>
                    <img
                      src={banner.image}
                      alt={`Banner ${index + 1}`}
                      className={styles.image}
                    />
                  </td>

                  <td>Banner {index + 1}</td>

                  <td>{banner.displayOrder}</td>

                  <td>
                    {banner.createdAt
                      ? new Date(
                          banner.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={
                        banner.status === "Active"
                          ? styles.active
                          : styles.inactive
                      }
                    >
                      {banner.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/banners/edit/${banner._id}`}
                        className={styles.actionBtn}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() =>
                          handleDelete(banner._id)
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}