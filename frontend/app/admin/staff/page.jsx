"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Staff.module.css";

const staff = [
  {
    id: 1,
    image: "https://i.pravatar.cc/60?img=11",
    name: "John Smith",
    email: "john@example.com",
    phone: "+91 9876543210",
    role: "Administrator",
    department: "Management",
    status: "Active",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/60?img=12",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+91 9876543211",
    role: "Sales Manager",
    department: "Sales",
    status: "Active",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/60?img=13",
    name: "David Johnson",
    email: "david@example.com",
    phone: "+91 9876543212",
    role: "Support",
    department: "Customer Care",
    status: "Inactive",
  },
];

export default function StaffPage() {
  const [search, setSearch] = useState("");

  const filtered = staff.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Staff</h1>
          <p>Manage all staff members</p>
        </div>

        <Link href="/admin/staff/add" className={styles.addBtn}>
          <Plus size={18} />
          Add Staff
        </Link>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Staff</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.staff}>
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.role}</td>
                <td>{item.department}</td>

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
                    <Link
                      href={`/admin/staff/edit/${item.id}`}
                      className={styles.actionBtn}
                    >
                      <Pencil size={18} />
                    </Link>

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