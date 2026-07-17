"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";

import styles from "./RefundRequest.module.css";

const API_URL = "http://localhost:5000/api/orders";

export default function RefundRequestPage() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Refund Requests
  const fetchRefunds = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}`);

      const data = await res.json();

      if (data.success) {
        const refundOrders = data.orders.filter(
          (item) =>
            item.orderStatus === "Cancelled" ||
            item.orderStatus === "Returned" ||
            item.refundRequested === true
        );

        setRefunds(refundOrders);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // Search
  const filteredOrders = useMemo(() => {
    return refunds.filter((order) => {
      const customer =
        order?.shippingAddress?.fullName?.toLowerCase() || "";

      const number =
        order?.orderNumber?.toString() || "";

      return (
        customer.includes(search.toLowerCase()) ||
        number.includes(search)
      );
    });
  }, [refunds, search]);

  // Approve Refund
  const approveRefund = async (id) => {
    try {
      setActionLoading(true);

      const res = await fetch(
        `${API_URL}/${id}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: "Refunded",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRefunds();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Refund
  const rejectRefund = async (id) => {
    try {
      setActionLoading(true);

      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: "Cancelled",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRefunds();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.refundPage}>
        <div className={styles.loading}>
          <Loader2 size={30} className={styles.spin} />
          <p>Loading Refund Requests...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.refundPage}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Refund Requests</h1>
          <p>Manage cancelled order refund requests</p>
        </div>

        <button
          className={styles.refreshBtn}
          onClick={fetchRefunds}
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {/* Search */}

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search Refund..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead className={styles.thead}>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Refund</th>
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
                    padding: "40px",
                  }}
                >
                  No Refund Requests Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order.orderNumber}</td>

                  <td>
                    {order.shippingAddress?.fullName}
                  </td>

                  <td>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span className={styles.payment}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <span className={styles.cancelled}>
                      {order.orderStatus}
                    </span>
                  </td>

                  <td>
                    <span className={styles.pending}>
                      {order.refundStatus || "Pending"}
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
                        title="Approve"
                        onClick={() =>
                          approveRefund(order._id)
                        }
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        title="Reject"
                        onClick={() =>
                          rejectRefund(order._id)
                        }
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
            {/* Refund Details Modal */}

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
              <h2>Refund Details</h2>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Order Info */}

            <div className={styles.section}>
              <h3>Order Information</h3>

              <div className={styles.grid}>
                <p>
                  <strong>Order Number</strong>
                  <br />
                  #{selectedOrder.orderNumber}
                </p>

                <p>
                  <strong>Order Status</strong>
                  <br />
                  {selectedOrder.orderStatus}
                </p>

                <p>
                  <strong>Payment Status</strong>
                  <br />
                  {selectedOrder.paymentStatus}
                </p>

                <p>
                  <strong>Payment Method</strong>
                  <br />
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Product */}

            <div className={styles.section}>
              <h3>Product Details</h3>

              <div className={styles.productCard}>
                <img
                  src={
                    selectedOrder.productId?.image ||
                    "/no-image.png"
                  }
                  alt=""
                  className={styles.productImage}
                />

                <div>
                  <h4>
                    {selectedOrder.productId?.name}
                  </h4>

                  <p>
                    Price :
                    ₹
                    {Number(
                      selectedOrder.productId?.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <p>
                    Quantity :
                    {selectedOrder.quantity}
                  </p>

                  <p>
                    Product ID :
                    {selectedOrder.productId?._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer */}

            <div className={styles.section}>
              <h3>Customer</h3>

              <div className={styles.grid}>
                <p>
                  <strong>Name</strong>
                  <br />
                  {selectedOrder.shippingAddress?.fullName}
                </p>

                <p>
                  <strong>Phone</strong>
                  <br />
                  {selectedOrder.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Address */}

            <div className={styles.section}>
              <h3>Shipping Address</h3>

              <p>
                {selectedOrder.shippingAddress?.address}
              </p>

              <p>
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.state}
              </p>

              <p>
                {selectedOrder.shippingAddress?.pincode}
              </p>

              <p>
                {selectedOrder.shippingAddress?.country}
              </p>
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
              <button
                className={styles.rejectBtn}
                disabled={actionLoading}
                onClick={() =>
                  rejectRefund(selectedOrder._id)
                }
              >
                <XCircle size={18} />
                Reject
              </button>

              <button
                className={styles.approveBtn}
                disabled={actionLoading}
                onClick={() =>
                  approveRefund(selectedOrder._id)
                }
              >
                <CheckCircle size={18} />
                Approve Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}