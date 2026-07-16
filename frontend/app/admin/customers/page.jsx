"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import styles from "./Customers.module.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setErrorMsg("");
        const response = await fetch("http://localhost:5000/api/auth/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send auth cookie
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setCustomers(data.users);
        } else {
          setErrorMsg(data.message || "Failed to load customers from database");
        }
      } catch (err) {
        setErrorMsg("Network error. Unable to connect to backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filtered = customers.filter((item) => {
    const nameMatch = item.fullName?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(search.toLowerCase());
    const phoneMatch = item.phone?.includes(search);
    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Customers</h1>
          <p>Manage all registered customers from MongoDB database</p>
        </div>

        <button className={styles.addBtn}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />
        <input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {errorMsg && (
        <div style={{
          padding: "12px 16px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fee2e2",
          color: "#b91c1c",
          borderRadius: "8px",
          fontSize: "14px"
        }}>
          {errorMsg}
        </div>
      )}

      <div className={styles.table}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "50px", gap: "10px", color: "var(--text-soft)" }}>
            <Loader2 className="animate-spin" size={24} style={{ color: "var(--primary)" }} />
            <span>Loading customers...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "50px", textAlign: "center", color: "var(--text-soft)" }}>
            No customers found.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                // Generate a consistent SVG avatar initials fallback in case img is not available
                const initials = item.fullName
                  ? item.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  : "?";

                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })
                  : "N/A";

                return (
                  <tr key={item._id}>
                    <td>
                      <div className={styles.customer}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "var(--primary)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "600",
                          border: "2px solid var(--line)"
                        }}>
                          {initials}
                        </div>
                        <span style={{ fontWeight: "500", marginLeft: "10px" }}>{item.fullName}</span>
                      </div>
                    </td>

                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      <span style={{
                        backgroundColor: "#f5efe9",
                        color: "var(--primary)",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase"
                      }}>
                        {item.role || "user"}
                      </span>
                    </td>
                    <td>{formattedDate}</td>

                    <td>
                      <span className={item.isBlocked ? styles.inactive : styles.active}>
                        {item.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button title="Edit User">
                          <Pencil size={18} />
                        </button>
                        <button title="Delete User">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}