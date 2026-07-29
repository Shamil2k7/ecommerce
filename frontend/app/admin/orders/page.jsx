"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

import styles from "./Orders.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const API = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API}/api/orders`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getOrders();
  }, []);

  const exportOrders = () => {
    const data = filteredOrders.map((order) => ({
      "Order No": order.orderNumber,
      Customer: order.shippingAddress?.fullName,
      Phone: order.shippingAddress?.phone,
      Date: new Date(order.createdAt).toLocaleDateString("en-IN"),
      "Payment Method": order.paymentMethod,
      "Payment Status": order.paymentStatus,
      "Order Status": order.orderStatus,
      "Subtotal": order.subTotal,
      Discount: order.discount,
      Tax: order.tax,
      Total: order.totalAmount,
      City: order.shippingAddress?.city,
      State: order.shippingAddress?.state,
      Pincode: order.shippingAddress?.pincode,
      Country: order.shippingAddress?.country,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Orders"
    );

    XLSX.writeFile(
      workbook,
      `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const deleteOrder = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Delete Order?",
      text: "Are you sure you want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Order deleted successfully");

        // Remove deleted order from state
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };
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

    const matchesSearch =
      orderNo.includes(search) ||
      customer.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
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
        toast.success(`Order status updated to ${status}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update order.");
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
      <div className={styles.controls}>

        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search Order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterContainer}>
          <label htmlFor="statusFilter">Status:</label>

          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
        <button
          onClick={exportOrders}
          className={styles.exportBtn}
        >
          Export Excel
        </button>
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
                      ${order.paymentStatus === "Paid"
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
                      ${order.orderStatus === "Delivered"
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
                        onClick={async () => {
                          const confirmResult = await Swal.fire({
                            title: "Cancel Order?",
                            text: "Are you sure you want to cancel this order?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, cancel it"
                          });
                          if (confirmResult.isConfirmed) {
                            updateStatus(order._id, "Cancelled");
                          }
                        }}
                      >
                        <XCircle size={18} />
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="delete-btn"
                      >
                        <Trash2 size={18} />
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

      <div className={styles.modalBody}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Customer Information</h3>

            <p>
              <strong>Name:</strong>{" "}
              {selectedOrder.shippingAddress?.fullName}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedOrder.shippingAddress?.phone}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedOrder.userId?.email || "N/A"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {selectedOrder.shippingAddress?.address}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {selectedOrder.shippingAddress?.city}
            </p>

            <p>
              <strong>State:</strong>{" "}
              {selectedOrder.shippingAddress?.state}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {selectedOrder.shippingAddress?.pincode}
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>Order Information</h3>

            <p>
              <strong>Order No:</strong>{" "}
              #{selectedOrder.orderNumber}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {selectedOrder.paymentMethod}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {selectedOrder.paymentStatus}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {selectedOrder.orderStatus}
            </p>

            <p>
              <strong>Subtotal:</strong> ₹
              {selectedOrder.subTotal}
            </p>

            <p>
              <strong>Discount:</strong> ₹
              {selectedOrder.discount}
            </p>

            <p>
              <strong>Tax:</strong> ₹
              {selectedOrder.tax}
            </p>

            <p>
              <strong>Shipping:</strong> ₹
              {selectedOrder.shipping}
            </p>

            <p className={styles.total}>
              Total : ₹{selectedOrder.totalAmount}
            </p>
          </div>
        </div>

        <h3 className={styles.productHeading}>
          Ordered Products
        </h3>

        {selectedOrder.products?.map((product, index) => (
          <div
            key={index}
            className={styles.productItem}
          >
            <img
              src={product.image || "/images/no-image.png"}
              alt={product.name}
              className={styles.productImage}
            />

            <div className={styles.productInfo}>
              <h4>{product.name}</h4>

              <p>
                <strong>Price:</strong> ₹{product.price}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {product.quantity}
              </p>

              <p>
                <strong>Subtotal:</strong> ₹
                {product.subtotal}
              </p>

              {product.color && (
                <p>
                  <strong>Color:</strong>{" "}
                  {product.color}
                </p>
              )}

              {product.size && (
                <p>
                  <strong>Size:</strong>{" "}
                  {product.size}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
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