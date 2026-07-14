"use client";

import Link from "next/link";
import styles from "./Orders.module.css";

const orders = [
  {
    id: "#1001",
    image: "/products/iphone.jpg",
    product: "iPhone 16 Pro",
    date: "12 Jul 2026",
    amount: "₹1,29,999",
    status: "Delivered",
  },
  {
    id: "#1002",
    image: "/products/shoe.jpg",
    product: "Nike Air Max",
    date: "10 Jul 2026",
    amount: "₹8,499",
    status: "Shipped",
  },
  {
    id: "#1003",
    image: "/products/headphone.jpg",
    product: "Sony Headphones",
    date: "05 Jul 2026",
    amount: "₹12,999",
    status: "Pending",
  },
];

export default function OrdersPage() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>My Orders</h1>
        <p>View and track your recent purchases.</p>
      </div>

      <div className={styles.orders}>
        {orders.map((order) => (
          <div className={styles.card} key={order.id}>
            <img
              src={order.image}
              alt={order.product}
              className={styles.image}
            />

            <div className={styles.info}>
              <h3>{order.product}</h3>

              <p>
                <strong>Order ID:</strong> {order.id}
              </p>

              <p>
                <strong>Date:</strong> {order.date}
              </p>

              <p>
                <strong>Total:</strong> {order.amount}
              </p>

              <span
                className={`${styles.status} ${
                  order.status === "Delivered"
                    ? styles.delivered
                    : order.status === "Shipped"
                    ? styles.shipped
                    : styles.pending
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className={styles.actions}>
              <Link href={`/orders/${order.id}`}>
                <button className={styles.primary}>
                  View Details
                </button>
              </Link>

              <button className={styles.secondary}>
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}