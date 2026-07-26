"use client";

import { useEffect, useState, Fragment } from "react";
import {
  Search,
  ChevronRight,
  XCircle,
  RotateCcw,
  Star,
  Package,
  Calendar,
  CreditCard,
  CheckCircle2,
  Ban,
} from "lucide-react";

import styles from "./Orders.module.css";
import axios from "axios";

const API_BASE = "http://localhost:5000";
const API_URL = `${API_BASE}/api/orders`;

const TABS = [
  { key: "All", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Processing", label: "Processing" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Cancelled" },
];

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewProductId, setReviewProductId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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
          order.products?.[0]?.name?.toLowerCase() || "";

        const matchesSearch =
          orderNo.includes(value) || product.includes(value);

        const matchesTab =
          activeTab === "All" || order.orderStatus === activeTab;

        return matchesSearch && matchesTab;
      })
    );
  }, [orders, search, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      

      const { data } = await axios.get(
        `${API_URL}/my-orders`,
        {
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
      

      const { data } = await axios.put(
        `${API_URL}/${id}/cancel`,
        {},
        {
          
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
      

      const { data } = await axios.put(
        `${API_URL}/${id}/request-refund`,
        {},
        {
          
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

  // ===== Review modal helpers =====

  const openReviewModal = (productId) => {
    setReviewProductId(productId);
    setRating(5);
    setComment("");
  };

  const closeReviewModal = () => {
    setReviewProductId(null);
    setRating(5);
    setComment("");
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a comment before submitting.");
      return;
    }

    try {
      setSubmittingReview(true);


      const { data } = await axios.post(
        `${API_BASE}/api/products/${reviewProductId}/review`,
        {
          rating: Number(rating),
          comment,
        },
        {
         withCredentials: true,
        }
      );

      if (data.success) {
        alert("Review Added");
        closeReviewModal();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const tabCount = (key) =>
    key === "All"
      ? orders.length
      : orders.filter((o) => o.orderStatus === key).length;

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
          <Search size={17} />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${
              activeTab === tab.key ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className={styles.tabCount}>{tabCount(tab.key)}</span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (

        <div className={styles.empty}>
          <Package size={64} />
          <h3>No Orders Found</h3>
          <p>Your orders will appear here.</p>
        </div>

      ) : (

        <div className={styles.list}>

          {filteredOrders.map((order) => (

            <div
              className={styles.row}
              key={order._id}
              onClick={() => setSelectedOrder(order)}
            >

              <div className={styles.thumb}>
                <img
                  src={order.products?.[0]?.productId?.images?.[0]?.url || order.products?.[0]?.image || "/no-image.png"}
                  alt={order.products?.[0]?.name}
                />
              </div>

              <div className={styles.rowBody}>

                <div className={styles.rowTitle}>
                  {order.products?.[0]?.name}
                </div>

                <div className={styles.rowMeta}>
                  <span>
                    <Package size={14} />
                    #{order.orderNumber}
                  </span>

                  <span>
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>

                  <span>
                    <CreditCard size={14} />
                    {order.paymentMethod}
                  </span>
                </div>

                <div className={styles.rowBadges}>
                  <span
                    className={`${styles.status} ${
                      styles[order.orderStatus.toLowerCase()]
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

              </div>

              <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>

                {(order.orderStatus === "Pending" ||
                  order.orderStatus === "Processing") && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => cancelOrder(order._id)}
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}

                {order.orderStatus === "Delivered" &&
                  order.paymentStatus === "Paid" && (
                    <button
                      className={styles.refundBtn}
                      onClick={() => requestRefund(order._id)}
                    >
                      <RotateCcw size={16} />
                      Refund
                    </button>
                  )}

                {order.orderStatus === "Delivered" && (
                  <button
                    className={styles.reviewBtn}
                    onClick={() => openReviewModal(order.products?.[0]?.productId?._id || order.products?.[0]?.productId)}
                  >
                    <Star size={16} />
                    Write Review
                  </button>
                )}

              </div>

              <div className={styles.rowSide}>
                <span className={styles.rowPrice}>
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </span>

                <div className={styles.rowArrow}>
                  <ChevronRight size={18} />
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

            <div className={styles.sheetHandle} />

            {/* Header */}

            <div className={styles.modalHeader}>

              <div>
                <h2>Order Details</h2>
                <p className={styles.modalSubtitle}>
                  #{selectedOrder.orderNumber}
                </p>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>

            </div>

            <div className={styles.modalBody}>

              {/* Status Tracker */}

              {selectedOrder.orderStatus === "Cancelled" ? (

                <div className={styles.cancelledBanner}>
                  <Ban size={20} />
                  <span>This order was cancelled</span>
                </div>

              ) : (

                <div className={styles.stepper}>
                  {STEPS.map((step, i) => {
                    const currentIndex = STEPS.indexOf(
                      selectedOrder.orderStatus
                    );
                    const done = i < currentIndex;
                    const active = i === currentIndex;

                    return (
                      <Fragment key={step}>
                        <div
                          className={`${styles.step} ${
                            done ? styles.stepDone : ""
                          } ${active ? styles.stepActive : ""}`}
                        >
                          <div className={styles.stepDot}>
                            {done ? <CheckCircle2 size={16} /> : null}
                          </div>
                          <span className={styles.stepLabel}>{step}</span>
                        </div>

                        {i < STEPS.length - 1 && (
                          <div
                            className={`${styles.stepConnector} ${
                              i < currentIndex
                                ? styles.stepConnectorDone
                                : ""
                            }`}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>

              )}

              {/* Product */}

              <div className={styles.section}>

                <div className={styles.product}>

                  <img
                    src={selectedOrder.products?.[0]?.productId?.images?.[0]?.url || selectedOrder.products?.[0]?.image || "/no-image.png"}
                    alt={selectedOrder.products?.[0]?.name || "Product"}
                  />

                  <div>

                    <h3>{selectedOrder.products?.[0]?.name}</h3>

                    <p>
                      Price :{" "}
                      <strong>
                        ₹
                        {Number(
                          selectedOrder.products?.[0]?.price || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </p>

                    <p>
                      Quantity : <strong>{selectedOrder.products?.[0]?.quantity}</strong>
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
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state}
                </p>

                <p>{selectedOrder.shippingAddress?.pincode}</p>

                <p>{selectedOrder.shippingAddress?.country}</p>

              </div>

              {/* Payment */}

              <div className={styles.section}>

                <h3>Payment Details</h3>

                <div className={styles.summaryRow}>
                  <span>Payment Method</span>
                  <strong>{selectedOrder.paymentMethod}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Payment Status</span>
                  <strong>{selectedOrder.paymentStatus}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Order Status</span>
                  <strong>{selectedOrder.orderStatus}</strong>
                </div>

              </div>

              {/* Order Summary */}

              <div className={styles.section}>

                <h3>Order Summary</h3>

                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {Number(selectedOrder.subTotal || 0).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Discount</span>
                  <span>
                    ₹
                    {Number(selectedOrder.discount || 0).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Tax</span>
                  <span>
                    ₹{Number(selectedOrder.tax || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <strong>Total</strong>
                  <strong>
                    ₹
                    {Number(selectedOrder.totalAmount || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

              </div>

            </div>

            {/* Footer */}

            <div className={styles.modalFooter}>

              {(selectedOrder.orderStatus === "Pending" ||
                selectedOrder.orderStatus === "Processing") && (
                <button
                  className={styles.cancelBtn}
                  onClick={() => cancelOrder(selectedOrder._id)}
                >
                  <XCircle size={18} />
                  Cancel Order
                </button>
              )}

              {selectedOrder.orderStatus === "Delivered" &&
                selectedOrder.paymentStatus === "Paid" && (
                  <button
                    className={styles.refundBtn}
                    onClick={() => requestRefund(selectedOrder._id)}
                  >
                    <RotateCcw size={18} />
                    Request Refund
                  </button>
                )}

              {selectedOrder.orderStatus === "Delivered" && (
                <button
                  className={styles.reviewBtn}
                  onClick={() =>
                    openReviewModal(selectedOrder.products?.[0]?.productId?._id || selectedOrder.products?.[0]?.productId)
                  }
                >
                  <Star size={18} />
                  Write Review
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

      {/* =========================
            Write Review Modal
      ========================== */}

      {reviewProductId && (

        <div
          className={styles.modalOverlay}
          onClick={closeReviewModal}
        >

          <div
            className={`${styles.modal} ${styles.reviewModal}`}
            onClick={(e) => e.stopPropagation()}
          >

            <div className={styles.sheetHandle} />

            <div className={styles.modalHeader}>
              <h2>Write a Review</h2>

              <button className={styles.closeBtn} onClick={closeReviewModal}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>

              <div className={styles.section}>

                <label className={styles.fieldLabel}>Your Rating</label>

                <select
                  className={styles.ratingSelect}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value={5}>★★★★★</option>
                  <option value={4}>★★★★☆</option>
                  <option value={3}>★★★☆☆</option>
                  <option value={2}>★★☆☆☆</option>
                  <option value={1}>★☆☆☆☆</option>
                </select>

                <label className={styles.fieldLabel}>Your Review</label>

                <textarea
                  className={styles.reviewTextarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                />

              </div>

            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.viewBtn}
                onClick={closeReviewModal}
              >
                Cancel
              </button>

              <button
                className={styles.reviewBtn}
                onClick={submitReview}
                disabled={submittingReview}
              >
                <Star size={18} />
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>

          </div>

        </div>

      )}

    </section>

  );

}