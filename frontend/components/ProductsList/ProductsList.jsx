"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductsList.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/products?page=${pageNumber}&limit=10`,
        {
          withCredentials: true, // Remove this if products API is public
        }
      );

      console.log(data);

      const products = data.data.products;

      setProducts((prev) =>
        pageNumber === 1
          ? products
          : [...prev, ...products]
      );

      setHasMore(
        pageNumber < data.data.pagination.totalPages
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              id: product._id,
              name: product.name,
              image:
                product.images?.find((img) => img.isPrimary)?.url ||
                product.images?.[0]?.url ||
                "/images/product-placeholder.png",
              category: product.category?.name,
              rating: product.ratingsAverage,
              reviews: product.ratingsCount,
              price: product.discountPrice || product.price,
              oldPrice:
                product.discountPrice > 0
                  ? product.price
                  : null,
              discount:
                product.discountPrice > 0
                  ? Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )
                  : 0,
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}