"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import styles from "./Orders.module.css";

const API_URL = "http://localhost:5000/api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(API_URL, {
        withCredentials: true,
      });

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderNo = order?.orderNumber?.toString() || "";
    const customer =
      order?.shippingAddress?.fullName?.toLowerCase() || "";

    return (
      orderNo.includes(search) ||
      customer.includes(search.toLowerCase())
    );
  });

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${id}`,
        {
          orderStatus: status,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setOrders((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  orderStatus: status,
                }
              : item
          )
        );

        if (selectedOrder?._id === id) {
          setSelectedOrder((prev) => ({
            ...prev,
            orderStatus: status,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order.");
    }
  };

  if (loading) {
    return (
      <section className={styles.orders}>
        <h2>Loading Orders...</h2>
      </section>
    );
  }

  return (
    <section className={styles.orders}>
      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search Order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order.orderNumber}</td>

                  <td>{order.shippingAddress?.fullName || "-"}</td>

                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    ₹
                    {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`${styles.payment}
                      ${
                        order.paymentStatus === "Paid"
                          ? styles.paid
                          : order.paymentStatus === "Pending"
                          ? styles.pending
                          : styles.failed
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`${styles.status}
                      ${
                        order.orderStatus === "Delivered"
                          ? styles.delivered
                          : order.orderStatus === "Processing"
                          ? styles.processing
                          : order.orderStatus === "Shipped"
                          ? styles.shipped
                          : styles.cancelled
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        title="View"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        title="Ship"
                        onClick={() =>
                          updateStatus(order._id, "Shipped")
                        }
                      >
                        <Truck size={18} />
                      </button>

                      <button
                        title="Delivered"
                        onClick={() =>
                          updateStatus(order._id, "Delivered")
                        }
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        title="Cancel"
                        onClick={() => {
                          if (confirm("Cancel this order?")) {
                            updateStatus(order._id, "Cancelled");
                          }
                        }}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Your modal content remains unchanged */}
          </div>
        </div>
      )}

      <div className={styles.pagination}>
        <button>Previous</button>
        <button className={styles.active}>1</button>
        <button>Next</button>
      </div>
    </section>
  );
}