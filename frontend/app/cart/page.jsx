"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import styles from "./Cart.module.css";

const cartItems = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    image: "/products/iphone.jpg",
    price: 129999,
    quantity: 1,
  },
  {
    id: 2,
    name: "Nike Air Max",
    image: "/products/shoe.jpg",
    price: 8499,
    quantity: 2,
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Shopping Cart</h1>
        <p>{cartItems.length} Items</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.cart}>
          {cartItems.map((item) => (
            <div
              className={styles.item}
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div className={styles.info}>
                <h3>{item.name}</h3>

                <p>₹{item.price.toLocaleString()}</p>
              </div>

              <div className={styles.quantity}>
                <button>
                  <Minus size={16} />
                </button>

                <span>{item.quantity}</span>

                <button>
                  <Plus size={16} />
                </button>
              </div>

              <div className={styles.total}>
                ₹
                {(
                  item.price * item.quantity
                ).toLocaleString()}
              </div>

              <button className={styles.delete}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.row}>
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className={styles.row}>
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <a href="/checkout">
            <button className={styles.checkout}>
              Checkout
            </button>
          </a>
          <Link
            href="/products"
            className={styles.continue}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}