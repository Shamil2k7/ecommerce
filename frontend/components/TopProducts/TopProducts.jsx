"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./TopProducts.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function TopProducts() {
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedProducts();
  }, []);

  const fetchTopRatedProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/products/top-rated`
      );

      if (data.success) {
        setTopRatedProducts(data.products);
      }
    } catch (error) {
      console.error(
        "Error fetching top rated products:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>Loading Top Rated Products...</h2>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Top Rated Products</h2>
          <p>Highest rated products by customers</p>
        </div>

        <button className={styles.button}>
          View All
        </button>
      </div>

      <div className={styles.grid}>
        {topRatedProducts.length > 0 ? (
          topRatedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <p>No top-rated products found.</p>
        )}
      </div>
    </section>
  );
}