"use client";

import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Wishlist.module.css";

const wishlist = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    category: "Electronics",
    image: "/products/iphone.jpg",
    price: 129999,
    oldPrice: 139999,
    discount: 10,
    rating: 4.9,
    reviews: 214,
  },
  {
    id: 2,
    name: "Nike Air Max",
    category: "Shoes",
    image: "/products/shoe.jpg",
    price: 8499,
    oldPrice: 9999,
    discount: 15,
    rating: 4.8,
    reviews: 118,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Electronics",
    image: "/products/headphone.jpg",
    price: 27999,
    oldPrice: 31999,
    discount: 12,
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 4,
    name: "Apple Watch Series 10",
    category: "Wearables",
    image: "/products/watch.jpg",
    price: 44999,
    oldPrice: 49999,
    discount: 10,
    rating: 4.9,
    reviews: 132,
  },
];

export default function WishlistPage() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>My Wishlist</h1>
        <p>
          Save your favourite products and buy them later.
        </p>
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
            Start adding products you love to your
            wishlist.
          </p>
        </div>
      )}
    </section>
  );
}