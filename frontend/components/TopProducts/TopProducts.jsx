"use client";
import styles from "./TopProducts.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useEffect, useState } from "react";
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

      const res = await fetch(`${API}/api/products/top-rated`);

      const data = await res.json();

      if (data.success) {
        setTopRatedProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching top rated products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>

      <div className={styles.header}>

        <div>
          <h2>Top Products</h2>
          <p>Most Popular Products</p>
        </div>

        <button className={styles.button}>
          View All
        </button>

      </div>

      <div className={styles.grid}>
        {topRatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />  
        ))}
      </div>

    </section>
  );
}