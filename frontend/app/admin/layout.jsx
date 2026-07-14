import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar/AdminNavbar";

import styles from "./AdminLayout.module.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "ShopAura Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}

      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>

      {/* Main Content */}

      <div className={styles.main}>

        {/* Navbar */}

        <header className={styles.header}>
          <AdminNavbar />
        </header>

        {/* Page Content */}

        <main className={styles.content}>
          {children}
        </main>

      </div>

    </div>
  );
}