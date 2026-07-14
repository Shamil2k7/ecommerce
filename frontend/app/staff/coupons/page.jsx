"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Coupons.module.css";

const coupons = [
  {
    id: 1,
    code: "WELCOME10",
    type: "Percentage",
    discount: "10%",
    minimum: "$50",
    expiry: "31 Dec 2026",
    status: "Active",
  },
  {
    id: 2,
    code: "SAVE100",
    type: "Fixed",
    discount: "$100",
    minimum: "$500",
    expiry: "15 Aug 2026",
    status: "Active",
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "Free Shipping",
    discount: "Free",
    minimum: "$30",
    expiry: "01 Jul 2026",
    status: "Expired",
  },
];

export default function CouponsPage() {
  const [search, setSearch] = useState("");

  const filtered = coupons.filter((item) =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Coupons</h1>
          <p>Manage discount coupons</p>
        </div>

        <Link href="/admin/coupons/add" className={styles.addBtn}>
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
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={styles.code}>{item.code}</span>
                </td>

                <td>{item.type}</td>

                <td>{item.discount}</td>

                <td>{item.minimum}</td>

                <td>{item.expiry}</td>

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
                      href={`/admin/coupons/edit/${item.id}`}
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