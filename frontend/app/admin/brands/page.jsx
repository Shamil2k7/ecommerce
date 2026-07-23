"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import styles from "./Brands.module.css";

export default function BrandsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setBrands(json.data);
        }
      })
      .catch((err) => console.error("Error loading brands:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/brands/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setBrands((prev) =>
          prev.filter((brand) => brand._id !== id)
        );
      } else {
        alert("Failed to delete brand");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting brand");
    }
  };

  const filtered = brands.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.container}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Brands</h1>
          <p>Manage your product brands</p>
        </div>

        <Link
          href="/admin/brands/add"
          className={styles.addBtn}
        >
          <Plus size={18} />
          Add Brand
        </Link>
      </div>

      {/* Search */}

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
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
                  Loading brands...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={
                        item.logo?.url
                          ? (item.logo.url.startsWith("http") ? item.logo.url : `http://localhost:5000${item.logo.url}`)
                          : "https://via.placeholder.com/60x60?text=Logo"
                      }
                      alt={item.name}
                      className={styles.image}
                    />
                  </td>

                  <td>{item.name}</td>

                  <td>{item.slug}</td>

                  <td>{item.description || "-"}</td>

                  <td>
                    <span
                      className={
                        item.isActive
                          ? styles.active
                          : styles.inactive
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => router.push(`/admin/brands/edit/${item._id}`)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
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
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}