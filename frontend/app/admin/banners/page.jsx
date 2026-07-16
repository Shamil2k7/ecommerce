"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Banners.module.css";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const getBanners = async () => {
    try {
      const res = await axios.get(`${API}/api/marketing/banners`);
      setBanners(res.data.banners || []);
    } catch (error) {
      console.error("Get Banners Error:", error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(`${API}/api/marketing/banners/${id}`);
      getBanners();
    } catch (error) {
      console.error("Delete Banner Error:", error);
    }
  };

  const filtered = banners.filter((banner) =>
    banner.displayOrder?.toString().includes(search)
  );

  return (
    <section className={styles.container}>
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

      <div className={styles.searchBox}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search banner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.image}
                      alt="Banner"
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
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}