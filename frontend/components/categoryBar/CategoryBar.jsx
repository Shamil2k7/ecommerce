"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./categoryBar.module.css";
const API = process.env.NEXT_PUBLIC_API_URL;
export default function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data || []);
      })
      .catch(console.error);
  }, []);

  // Parent Categories
  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  // Sub Categories
  const getChildren = (parentId) => {
    return categories.filter((cat) => {
      const pid =
        typeof cat.parentCategory === "object"
          ? cat.parentCategory?._id
          : cat.parentCategory;

      return pid === parentId;
    });
  };

  return (
    <section className={styles.categoryBar}>
      <div className={styles.container}>
        <div className={styles.list}>
          {/* All Products */}
          <Link href="/products" className={styles.item}>
            <span className={styles.name}>All</span>
          </Link>

          {/* Parent Categories */}
          {parentCategories.map((parent) => {
            const children = getChildren(parent._id);

            return (
              <div key={parent._id} className={styles.itemWrapper}>
                <Link
                  href={`/products?category=${encodeURIComponent(parent.name)}`}
                  className={styles.item}
                >
                  <span className={styles.name}>{parent.name}</span>
                </Link>

                {/* Mega Menu */}
                {children.length > 0 && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaContainer}>
                      <div className={styles.column}>
                        <h4>{parent.name}</h4>

                        {children.map((child) => (
                          <Link
                            key={child._id}
                            href={`/products?category=${encodeURIComponent(
                              child.name
                            )}`}
                            className={styles.subCategory}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}