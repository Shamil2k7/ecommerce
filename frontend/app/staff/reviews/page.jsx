"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

import styles from "./Reviews.module.css";

const reviews = [
  {
    id: 1,
    product: "iPhone 16 Pro",
    image: "/products/iphone.jpg",
    customer: "John Smith",
    rating: 5,
    review: "Excellent phone. Amazing camera quality.",
    date: "12 Jul 2026",
    status: "Published",
  },
  {
    id: 2,
    product: "Nike Air Max",
    image: "/products/shoe.jpg",
    customer: "Sarah Wilson",
    rating: 4,
    review: "Comfortable shoes with great quality.",
    date: "10 Jul 2026",
    status: "Pending",
  },
];

export default function ReviewsPage() {
  const [search, setSearch] = useState("");

  const filtered = reviews.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Reviews</h1>
          <p>Manage customer reviews</p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search review..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.product}>
                    <img src={item.image} alt={item.product} />
                    <span>{item.product}</span>
                  </div>
                </td>

                <td>{item.customer}</td>

                <td>
                  <div className={styles.rating}>
                    <Star size={16} fill="#facc15" color="#facc15" />
                    {item.rating}/5
                  </div>
                </td>

                <td className={styles.review}>
                  {item.review}
                </td>

                <td>{item.date}</td>

                <td>
                  <span
                    className={
                      item.status === "Published"
                        ? styles.active
                        : styles.pending
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button>
                      <Eye size={18} />
                    </button>

                    <Link href={`/admin/reviews/edit/${item.id}`}>
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