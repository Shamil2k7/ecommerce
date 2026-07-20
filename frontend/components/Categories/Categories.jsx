"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Categories.module.css";

export default function Categories() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Shop By Category</h2>

          <Link href="/categories">View All →</Link>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              href={`/products?category=${category.slug}`}
              key={category._id}
              className={styles.card}
            >
              <Image
                src={category.image?.url || "/placeholder-category.jpg"}
                alt={category.name}
                fill
                className={styles.image}
              />

              <div className={styles.overlay}></div>

              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}