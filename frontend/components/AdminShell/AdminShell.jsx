"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar/AdminNavbar";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.show : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <header className={styles.header}>
          <AdminNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}