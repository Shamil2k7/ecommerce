"use client";

import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./HeroSection.module.css";

const heroSections = [
  {
    id: 1,
    brand: "Eucerin",
    offer: "Upto 15% Off",
    subOffer: "Anti-Pigment Duo!",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
    displayOrder: 1,
    status: "Active",
  },
  {
    id: 2,
    brand: "ISDIN",
    offer: "Most Loved",
    subOffer: "Ultralight SPF",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    displayOrder: 2,
    status: "Active",
  },
  {
    id: 3,
    brand: "URIAGE",
    offer: "Made in France",
    subOffer: "Dermat Recommended",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    displayOrder: 3,
    status: "Inactive",
  },
  {
    id: 4,
    brand: "Minimalist",
    offer: "Buy 2 Get 1 Free",
    subOffer: "On All Serums",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900",
    displayOrder: 4,
    status: "Active",
  },
];

export default function HeroSectionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hero Sections</h1>

        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Search hero sections..." />
          </div>

          <Link
            href="/admin/HeroSection/Add"
            className={styles.addBtn}
          >
            <Plus size={18} />
            Add Hero Section
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand</th>
              <th>Offer</th>
              <th>Sub Offer</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {heroSections.map((hero) => (
              <tr key={hero.id}>
                <td>
                  <img
                    src={hero.image}
                    alt={hero.brand}
                    className={styles.image}
                  />
                </td>

                <td>{hero.brand}</td>
                <td>{hero.offer}</td>
                <td>{hero.subOffer}</td>
                <td>{hero.displayOrder}</td>

                <td>
                  <span
                    className={
                      hero.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }
                  >
                    {hero.status}
                  </span>
                </td>

                <td>
                  <div className={styles.buttons}>
                    <button className={styles.edit}>
                      <Pencil size={18} />
                    </button>

                    <button className={styles.delete}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}