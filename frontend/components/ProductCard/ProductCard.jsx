import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>

      <div className={styles.imageContainer}>

        {product.discount && (
          <span className={styles.discount}>
            -{product.discount}%
          </span>
        )}

        <button className={styles.wishlist}>
          <Heart size={18} />
        </button>

        <Link href={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />
        </Link>

      </div>

      <div className={styles.content}>

        <p className={styles.category}>
          {product.category}
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

          <span>{product.rating}</span>

          <small>({product.reviews})</small>

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

        <button className={styles.cartButton}>

          <ShoppingCart size={18} />

          Add to Cart

        </button>

      </div>

    </div>
  );
}