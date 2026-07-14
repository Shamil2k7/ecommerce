"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Banners.module.css";

const banners = [
  {
    id: 1,
    image: "/offerbanner1.jfif",
    order: 1,
    status: "Active",
    created: "12 Jul 2026",
  },
  {
    id: 2,
    image: "/offerbanner1.jfif",
    order: 2,
    status: "Active",
    created: "11 Jul 2026",
  },
  {
    id: 3,
    image: "/offerbanner1.jfif",
    order: 3,
    status: "Inactive",
    created: "10 Jul 2026",
  },
];

export default function BannerPage() {
  const [search, setSearch] = useState("");

  const filtered = banners.filter((item) =>
    item.id.toString().includes(search)
  );

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

      {/* Search */}

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search banner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt="Banner"
                    className={styles.image}
                  />
                </td>

                <td>Banner {item.id}</td>

                <td>{item.order}</td>

                <td>{item.created}</td>

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
                      href={`/admin/banners/edit/${item.id}`}
                      className={styles.actionBtn}
                    >
                      <Pencil size={18} />
                    </Link>

                    <button>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}