"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className={styles.navbar}>
      {/* Left */}

      <div className={styles.left}>

        <button className={styles.menuBtn}>
          <Menu size={22} />
        </button>

        <div className={styles.searchBox}>

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      {/* Right */}

      <div className={styles.right}>

        <button
          className={styles.iconBtn}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.iconBtn}>
          <MessageSquare size={20} />
          <span className={styles.badge}>5</span>
        </button>

        {/* Profile */}

        <div className={styles.profile}>

          <div className={styles.avatar}>
            <User size={20} />
          </div>

          <div className={styles.info}>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

          <ChevronDown size={18} />

          {/* Dropdown */}

          <div className={styles.dropdown}>

            <button>
              <User size={18} />
              Profile
            </button>

            <button>
              <Settings size={18} />
              Settings
            </button>

            <button className={styles.logout}>
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}