"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ShoppingCart, Star } from "lucide-react";
import styles from "./ProductCard.module.css";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageSrc, setImageSrc] = useState(
    product.image
  );
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      console.error("Add To Cart Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkWishlist();
  }, []);

  const checkWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const { data } = await axios.get(
        `${API}/api/wishlist/check/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlisted(data.wishlisted);
    } catch (err) {
      console.log(err);
    }
  };
  const toggleWishlist = async () => {
    try {
      setWishlistLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.post(
        `${API}/api/wishlist/toggle/${product.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlisted(data.wishlisted);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {product.discount > 0 && (
          <span className={styles.discount}>
            -{product.discount}%
          </span>
        )}

        <button
          className={styles.wishlist}
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart
            size={18}
            fill={wishlisted ? "#ef4444" : "none"}
            color={wishlisted ? "#ef4444" : "#444"}
          />
        </button>

        <Link href={`/products/${product.id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={() => setImageSrc("/images/headphone.png")}
          />
        </Link>
      </div>

      <div className={styles.content}>
        <p className={styles.category}>
          {product.category || "Uncategorized"}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className={styles.title}>
            {product.name}
          </h3>
        </Link>

        <div className={styles.rating}>
          <Star
            size={15}
            fill="#D98A2B"
            color="#D98A2B"
          />

          <span>{product.rating || 0}</span>

          <small>({product.reviews || 0})</small>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className={styles.oldPrice}>
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        <button
          className={styles.cartButton}
          onClick={handleAddToCart}
          disabled={loading}
        >
          <ShoppingCart size={18} />

          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}