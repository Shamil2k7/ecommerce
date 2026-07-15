"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Profile.module.css";
import { User, Mail, Phone, Shield, Calendar, Key, LogOut, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout, checkAuth } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Recheck auth on profile mount to get updated details (e.g. createdAt from db)
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/auth/login");
    }
  };

  // Get initial letters of the user's name for avatar placeholder
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.loaderWrapper}>
          <Loader2 className={styles.spin} size={40} />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Formatting date safely
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>{getInitials(user.fullName)}</div>
          <h1>{user.fullName}</h1>
          <p>Manage your account settings & credentials.</p>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <div className={styles.labelInfo}>
              <User size={18} />
              <span>Full Name</span>
            </div>
            <div className={styles.value}>{user.fullName}</div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelInfo}>
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <div className={styles.value}>{user.email}</div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelInfo}>
              <Phone size={18} />
              <span>Phone Number</span>
            </div>
            <div className={styles.value}>{user.phone}</div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelInfo}>
              <Shield size={18} />
              <span>Role</span>
            </div>
            <div>
              <span className={styles.roleBadge}>{user.role || "user"}</span>
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelInfo}>
              <Calendar size={18} />
              <span>Joined On</span>
            </div>
            <div className={styles.value}>{formattedDate}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => router.push("/auth/change-password")}
            className={styles.changePasswordBtn}
          >
            <Key size={16} />
            Change Password
          </button>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}