"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import styles from "./Customers.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [blockingId, setBlockingId] = useState(null); // tracks which user is being updated

  // Load customers when the page opens
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setErrorMsg("");
        const response = await fetch(`${API_URL}/api/auth/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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

  // Block or Unblock a customer
  const handleToggleBlock = async (customer) => {
    const action = customer.isBlocked ? "unblock" : "block";

    const confirmResult = await Swal.fire({
      title: `${action === "block" ? "Block" : "Unblock"} Customer?`,
      text: `Are you sure you want to ${action} ${customer.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "block" ? "#d33" : "#3085d6",
      cancelButtonColor: "#6e7881",
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel"
    });

    if (!confirmResult.isConfirmed) return;

    setBlockingId(customer._id);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/users/${customer._id}/block`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the customer list immediately without refetching
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === customer._id ? { ...c, isBlocked: data.isBlocked } : c
          )
        );
      } else {
        alert(data.message || `Failed to ${action} user.`);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setBlockingId(null);
    }
  };

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
          <p>Manage all registered customers</p>
        </div>
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
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {errorMsg}
        </div>
      )}

      <div className={styles.table}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "50px",
              gap: "10px",
              color: "var(--text-soft)",
            }}
          >
            <Loader2
              className="animate-spin"
              size={24}
              style={{ color: "var(--primary)" }}
            />
            <span>Loading customers...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                const initials = item.fullName
                  ? item.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";

                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                const isUpdating = blockingId === item._id;

                return (
                  <tr key={item._id}>
                    <td>
                      <div className={styles.customer}>
                        <div
                          style={{
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
                            border: "2px solid var(--line)",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <span style={{ fontWeight: "500", marginLeft: "10px" }}>
                          {item.fullName}
                        </span>
                      </div>
                    </td>

                    <td>{item.email}</td>
                    <td>{item.phone}</td>

                    <td>
                      <span
                        style={{
                          backgroundColor: "#f5efe9",
                          color: "var(--primary)",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.role || "user"}
                      </span>
                    </td>

                    <td>{formattedDate}</td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleToggleBlock(item)}
                          disabled={isUpdating}
                          title={item.isBlocked ? "Unblock User" : "Block User"}
                          className={
                            item.isBlocked ? styles.unblockBtn : styles.blockBtn
                          }
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : item.isBlocked ? (
                            "Unblock"
                          ) : (
                            "Block"
                          )}
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