"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  XCircle,
  RotateCcw,
  Package,
  Calendar,
  CreditCard,
} from "lucide-react";

import styles from "./Orders.module.css";
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";



export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredOrders(
      orders.filter((order) => {
        const orderNo =
          order.orderNumber?.toString().toLowerCase() || "";

        const product =
          order.productId?.name?.toLowerCase() || "";

        return (
          orderNo.includes(value) ||
          product.includes(value)
        );
      })
    );
  }, [orders, search]);

const fetchOrders = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${API_URL}/my-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (data.success) {
      setOrders(data.orders);
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

 const cancelOrder = async (id) => {
  if (!confirm("Cancel this order?")) return;

  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.put(
      `${API_URL}/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (data.success) {
      fetchOrders();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

 const requestRefund = async (id) => {
  if (!confirm("Request refund?")) return;

  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.put(
      `${API_URL}/${id}/request-refund`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (data.success) {
      alert("Refund request submitted");
      fetchOrders();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
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

      <div className={styles.topBar}>

        <div>
          <h1>My Orders</h1>
          <p>Track and manage your purchases</p>
        </div>

        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>

      {filteredOrders.length === 0 ? (

        <div className={styles.empty}>
          <Package size={70} />
          <h3>No Orders Found</h3>
          <p>Your orders will appear here.</p>
        </div>

      ) : (

        <div className={styles.grid}>

          {filteredOrders.map((order) => (

            <div
              className={styles.card}
              key={order._id}
            >

              <div className={styles.imageBox}>

                <img
                  src={
                    order.productId?.image ||
                    "/no-image.png"
                  }
                  alt={order.productId?.name}
                />

              </div>

              <div className={styles.content}>

                <h2>
                  {order.productId?.name}
                </h2>

                <div className={styles.info}>

                  <span>
                    <Package size={15} />
                    #{order.orderNumber}
                  </span>

                  <span>
                    <Calendar size={15} />
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </span>

                  <span>
                    <CreditCard size={15} />
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

                <div className={styles.badges}>

                  <span
                    className={`${styles.status} ${
                      styles[
                        order.orderStatus.toLowerCase()
                      ]
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <span
                    className={`${styles.payment} ${
                      order.paymentStatus === "Paid"
                        ? styles.paid
                        : styles.pending
                    }`}
                  >
                    {order.paymentStatus}
                  </span>

                </div>

                <div className={styles.buttons}>

                  <button
                    className={styles.viewBtn}
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >
                    <Eye size={18} />
                    View Details
                  </button>

                  {(order.orderStatus ===
                    "Pending" ||
                    order.orderStatus ===
                      "Processing") && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() =>
                        cancelOrder(order._id)
                      }
                    >
                      <XCircle size={18} />
                      Cancel
                    </button>
                  )}

                  {order.orderStatus ===
                    "Delivered" &&
                    order.paymentStatus ===
                      "Paid" && (
                    <button
                      className={styles.refundBtn}
                      onClick={() =>
                        requestRefund(order._id)
                      }
                    >
                      <RotateCcw size={18} />
                      Refund
                    </button>
                  )}
                                  </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =========================
            Order Details Modal
      ========================== */}

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

              <div className={styles.product}>

                <img
                  src={
                    selectedOrder.productId?.image ||
                    "/no-image.png"
                  }
                  alt="Product"
                />

                <div>

                  <h3>
                    {selectedOrder.productId?.name}
                  </h3>

                  <p>
                    Price :
                    <strong>
                      ₹
                      {Number(
                        selectedOrder.productId?.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </p>

                  <p>
                    Quantity :
                    <strong>
                      {selectedOrder.quantity}
                    </strong>
                  </p>

                </div>

              </div>

            </div>

            {/* Shipping Address */}

            <div className={styles.section}>

              <h3>Shipping Address</h3>

              <p>
                <strong>Name :</strong>{" "}
                {selectedOrder.shippingAddress?.fullName}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {selectedOrder.shippingAddress?.phone}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {selectedOrder.shippingAddress?.address}
              </p>

              <p>
                {selectedOrder.shippingAddress?.city},
                {" "}
                {selectedOrder.shippingAddress?.state}
              </p>

              <p>
                {selectedOrder.shippingAddress?.pincode}
              </p>

              <p>
                {selectedOrder.shippingAddress?.country}
              </p>

            </div>

            {/* Payment */}

            <div className={styles.section}>

              <h3>Payment Details</h3>

              <div className={styles.summaryRow}>
                <span>Payment Method</span>
                <strong>
                  {selectedOrder.paymentMethod}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Payment Status</span>
                <strong>
                  {selectedOrder.paymentStatus}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Order Status</span>
                <strong>
                  {selectedOrder.orderStatus}
                </strong>
              </div>

            </div>

            {/* Order Summary */}

            <div className={styles.section}>

              <h3>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>

                <span>
                  ₹
                  {Number(
                    selectedOrder.subTotal || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span>Discount</span>

                <span>
                  ₹
                  {Number(
                    selectedOrder.discount || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax</span>

                <span>
                  ₹
                  {Number(
                    selectedOrder.tax || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <strong>Total</strong>

                <strong>
                  ₹
                  {Number(
                    selectedOrder.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

            {/* Footer */}

            <div className={styles.modalFooter}>

              {(selectedOrder.orderStatus === "Pending" ||
                selectedOrder.orderStatus === "Processing") && (

                <button
                  className={styles.cancelBtn}
                  onClick={() =>
                    cancelOrder(selectedOrder._id)
                  }
                >
                  <XCircle size={18} />
                  Cancel Order
                </button>

              )}

              {selectedOrder.orderStatus === "Delivered" &&
                selectedOrder.paymentStatus === "Paid" && (

                <button
                  className={styles.refundBtn}
                  onClick={() =>
                    requestRefund(selectedOrder._id)
                  }
                >
                  <RotateCcw size={18} />
                  Request Refund
                </button>

              )}

              <button
                className={styles.viewBtn}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

}