"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Staff.module.css";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // take all staff from backend 

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStaff(data.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ==========================
  // Delete Staff
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Staff deleted successfully");

      fetchStaff();
    } catch (error) {
      alert(error.message);
    }
  };


  //  search items (i mean staff) by name
  const filtered = staff.filter((item) =>
    (item.fullName || "")
      .toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <section className={styles.container}>
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Staff</h1>
          <p>Manage all staff members</p>
        </div>

        <Link
          href="/admin/staff/add"
          className={styles.addBtn}
        >
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
              {/* <th>name</th> */}
              <th>Staff</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item._id}>
                  <td className={styles.staffCell}>
                    <div className={styles.staff}>
                      <img
                        src={item.profileImage || "https://via.placeholder.com/60"}
                        alt={item.fullName || "Staff"}
                      />

                      <div className={styles.staffInfo}>
                        <span className={styles.staffName}>
                          {item.fullName}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>{item.email}</td>

                  <td>{item.phone}</td>

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
                        href={`/admin/staff/edit/${item._id}`}
                        className={styles.actionBtn}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  No Staff Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}