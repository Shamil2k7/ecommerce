"use client";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    getUsers();
    getOrders();
    getOrderCounts();
    getProducts();
    getLowStockProducts();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/users`, {
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`, {
        withCredentials: true,
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderCounts = async () => {
    try {
      const res = await axios.get(`${API}/api/orders/counts`, {
        withCredentials: true,
      });

      setOrderCounts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`, {
        withCredentials: true,
      });

      setProducts(res.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getLowStockProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products/inventory/low-stock`, {
        withCredentials: true,
      });

      setLowStock(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.dashboard}>
      {/* Heading */}

      <div className={styles.heading}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin 👋</p>
        </div>
      </div>

      {/* Cards */}

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <IndianRupee size={30} />
          </div>

          <div>
            <h3>Revenue</h3>
            <h2>₹{orderCounts.totalRevenue.toLocaleString()}</h2>
            <span>Total Revenue</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <ShoppingCart size={30} />
          </div>

          <div>
            <h3>Orders</h3>
            <h2>{orderCounts.totalOrders}</h2>
            <span>{orderCounts.pendingOrders} Pending</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <Package size={30} />
          </div>

          <div>
            <h3>Products</h3>
            <h2>{products.length}</h2>
            <span>{lowStock.length} Low Stock</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <Users size={30} />
          </div>

          <div>
            <h3>Customers</h3>
            <h2>{users.length}</h2>
            <span>Total Registered Users</span>
          </div>
        </div>
      </div>

      {/* Charts */}

      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2>Sales Overview</h2>

            <TrendingUp size={22} />
          </div>

          <div className={styles.chartPlaceholder}>Chart Area</div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2>Low Stock</h2>

            <AlertTriangle size={22} />
          </div>

          <div className={styles.stockList}>
            {lowStock.length === 0 ? (
              <p>No low stock products</p>
            ) : (
              lowStock.map((item) => (
                <div key={item._id}>
                  <span>{item.name}</span>
                  <strong>{item.stock} Left</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className={styles.bottom}>
        {/* Orders */}

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2>Recent Orders</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>#{order.orderNumber}</td>

                  <td>{order.userId?.fullName}</td>

                  <td>₹{order.totalAmount}</td>

                  <td>
                    <span className={styles.status}>{order.orderStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products */}

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2>Top Products</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.sold ?? 0}</td>
                  <td>{item.stock ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}