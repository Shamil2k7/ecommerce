"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Wishlist.module.css";
import TopProducts from "@/components/TopProducts/TopProducts";

export default function WishlistPage() {
  const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${API}/api/wishlist`, {
        withCredentials: true, // if using cookies
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      const products = data.wishlist.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        image:
          item.product.images?.[0]?.url ||
          item.product.image ||
          "/products/default.png",
        price: item.product.price,
        oldPrice: item.product.oldPrice,
        discount: item.product.discount || 0,
        rating: item.product.rating || 0,
        reviews: item.product.numReviews || 0,
        category: item.product.category?.name || "Uncategorized",
        brand: item.product.brand?.name,
        stock: item.product.stock,
      }));

      setWishlist(products);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <h2>Loading Wishlist...</h2>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>My Wishlist</h1>
        <p>Save your favourite products and buy them later.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className={styles.grid}>
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <img
            src="/empty-wishlist.svg"
            alt="Wishlist Empty"
          />

          <h2>Your Wishlist is Empty</h2>

          <p>
            Start adding products you love to your wishlist.
          </p>
        </div>
      )}
            <TopProducts />
      
    </section>
  );
}