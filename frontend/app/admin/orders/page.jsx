"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import styles from "./Orders.module.css";

const orders = [
  {
    id: "#ORD1001",
    customer: "John Doe",
    date: "13 Jul 2026",
    total: 5499,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD1002",
    customer: "Emma Watson",
    date: "12 Jul 2026",
    total: 1299,
    payment: "Pending",
    status: "Processing",
  },
  {
    id: "#ORD1003",
    customer: "Michael",
    date: "11 Jul 2026",
    total: 8999,
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "#ORD1004",
    customer: "Sarah",
    date: "10 Jul 2026",
    total: 2499,
    payment: "Failed",
    status: "Cancelled",
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.orders}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>
      </div>

      {/* Search */}

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search Order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}

      <div className={styles.tableWrapper}>
        <table>

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>{order.date}</td>

                <td>₹{order.total.toLocaleString()}</td>

                <td>
                  <span
                    className={`${styles.payment} ${
                      order.payment === "Paid"
                        ? styles.paid
                        : order.payment === "Pending"
                        ? styles.pending
                        : styles.failed
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>

                <td>

                  <span
                    className={`${styles.status} ${
                      order.status === "Delivered"
                        ? styles.delivered
                        : order.status === "Processing"
                        ? styles.processing
                        : order.status === "Shipped"
                        ? styles.shipped
                        : styles.cancelled
                    }`}
                  >
                    {order.status}
                  </span>

                </td>

                <td>

                  <div className={styles.actions}>

                    <button title="View">
                      <Eye size={18} />
                    </button>

                    <button title="Ship">
                      <Truck size={18} />
                    </button>

                    <button title="Complete">
                      <CheckCircle size={18} />
                    </button>

                    <button title="Cancel">
                      <XCircle size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

      {/* Pagination */}

      <div className={styles.pagination}>
        <button>Previous</button>
        <button className={styles.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
    </section>
  );
}