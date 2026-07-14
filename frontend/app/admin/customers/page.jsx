"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Customers.module.css";

const customers = [
  {
    id: 1,
    image: "https://i.pravatar.cc/60?img=1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    location: "Kerala",
    orders: 15,
    spent: "$1,250",
    status: "Active",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/60?img=2",
    name: "Emma Watson",
    email: "emma@example.com",
    phone: "+91 9876543211",
    location: "Delhi",
    orders: 8,
    spent: "$640",
    status: "Active",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/60?img=3",
    name: "Michael Lee",
    email: "michael@example.com",
    phone: "+91 9876543212",
    location: "Mumbai",
    orders: 3,
    spent: "$220",
    status: "Inactive",
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Customers</h1>
          <p>Manage all registered customers</p>
        </div>

        <button className={styles.addBtn}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.customer}>
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td>{item.email}</td>

                <td>{item.phone}</td>

                <td>{item.location}</td>

                <td>{item.orders}</td>

                <td>{item.spent}</td>

                <td>
                  <span
                    className={
                      item.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button>
                      <Pencil size={18} />
                    </button>

                    <button>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}