"use client";

import { useEffect, useState } from "react";
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

      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      });

      const data = await res.json();

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
      }
    } catch (err) {
      console.log(err);
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
            {/* Orders Table */}

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
                  colSpan="7"
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
                  <td>
                    #{order.orderNumber}
                  </td>

                  <td>
                    {order.shippingAddress?.fullName || "-"}
                  </td>

                  <td>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
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
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        title="Ship"
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Shipped"
                          )
                        }
                      >
                        <Truck size={18} />
                      </button>

                      <button
                        title="Delivered"
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Delivered"
                          )
                        }
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        title="Cancel"
                        onClick={() => {
                          if (
                            confirm(
                              "Cancel this order?"
                            )
                          ) {
                            updateStatus(
                              order._id,
                              "Cancelled"
                            );
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
            {/* Order Details Modal */}

      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className={styles.modalHeader}>
              <h2>Order Details</h2>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Product */}

            <div className={styles.section}>
              <h3>Product Details</h3>

              <div className={styles.product}>
                <img
                  src={
                    selectedOrder?.productId?.image ||
                    "/no-image.png"
                  }
                  alt={
                    selectedOrder?.productId?.name ||
                    "Product"
                  }
                />

                <div>
                  <h4>
                    {selectedOrder?.productId?.name ||
                      "Product"}
                  </h4>

                  <p>
                    <strong>Price:</strong> ₹
                    {Number(
                      selectedOrder?.productId?.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {selectedOrder?.quantity}
                  </p>

                  <p>
                    <strong>Product ID:</strong>{" "}
                    {selectedOrder?.productId?._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer */}

            <div className={styles.section}>
              <h3>Customer Details</h3>

              <p>
                <strong>Name:</strong>{" "}
                {selectedOrder?.shippingAddress?.fullName}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder?.shippingAddress?.phone}
              </p>
            </div>

            {/* Shipping */}

            <div className={styles.section}>
              <h3>Shipping Address</h3>

              <p>
                {selectedOrder?.shippingAddress?.address}
              </p>

              <p>
                {selectedOrder?.shippingAddress?.city},{" "}
                {selectedOrder?.shippingAddress?.state}
              </p>

              <p>
                {selectedOrder?.shippingAddress?.pincode}
              </p>

              <p>
                {selectedOrder?.shippingAddress?.country}
              </p>
            </div>

            {/* Payment */}

            <div className={styles.section}>
              <h3>Payment Information</h3>

              <p>
                <strong>Method:</strong>{" "}
                {selectedOrder?.paymentMethod}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder?.paymentStatus}
              </p>

              <p>
                <strong>Order Status:</strong>{" "}
                {selectedOrder?.orderStatus}
              </p>
            </div>

            {/* Summary */}

            <div className={styles.section}>
              <h3>Order Summary</h3>

              <p>
                <strong>Subtotal:</strong> ₹
                {Number(
                  selectedOrder?.subTotal || 0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Discount:</strong> ₹
                {Number(
                  selectedOrder?.discount || 0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Tax:</strong> ₹
                {Number(
                  selectedOrder?.tax || 0
                ).toLocaleString("en-IN")}
              </p>

              <h2>
                Total: ₹
                {Number(
                  selectedOrder?.totalAmount || 0
                ).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}

      <div className={styles.pagination}>
        <button>Previous</button>
        <button className={styles.active}>1</button>
        <button>Next</button>
      </div>

    </section>
  );
}