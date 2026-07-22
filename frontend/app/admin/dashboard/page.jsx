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

const recentOrders = [
  {
    id: "#1001",
    customer: "John Doe",
    total: "₹2,499",
    status: "Delivered",
  },
  {
    id: "#1002",
    customer: "Sarah",
    total: "₹5,799",
    status: "Pending",
  },
  {
    id: "#1003",
    customer: "Michael",
    total: "₹899",
    status: "Shipped",
  },
  {
    id: "#1004",
    customer: "Emma",
    total: "₹1,299",
    status: "Cancelled",
  },
];

const topProducts = [
  {
    name: "iPhone 16 Pro",
    sold: 120,
    stock: 32,
  },
  {
    name: "Nike Air Max",
    sold: 95,
    stock: 18,
  },
  {
    name: "Sony Headphones",
    sold: 72,
    stock: 9,
  },
  {
    name: "Gaming Mouse",
    sold: 51,
    stock: 40,
  },
];

export default function DashboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
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
            <h2>₹2,45,800</h2>
            <span>+18% this month</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <ShoppingCart size={30} />
          </div>

          <div>
            <h3>Orders</h3>
            <h2>1,258</h2>
            <span>42 Today</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <Package size={30} />
          </div>

          <div>
            <h3>Products</h3>
            <h2>356</h2>
            <span>18 Low Stock</span>
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
            <div>
              <span>Gaming Keyboard</span>
              <strong>4 Left</strong>
            </div>

            <div>
              <span>Apple Watch</span>
              <strong>2 Left</strong>
            </div>

            <div>
              <span>Bluetooth Speaker</span>
              <strong>6 Left</strong>
            </div>

            <div>
              <span>Office Chair</span>
              <strong>3 Left</strong>
            </div>
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={styles.status}>{order.status}</span>
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
              {topProducts.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.sold}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}