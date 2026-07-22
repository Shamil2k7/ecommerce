"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";

import styles from "./AdminNavbar.module.css";

export default function AdminNavbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile dropdown on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className={styles.navbar}>
      {/* Left */}
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Mobile search trigger */}
        <button
          className={styles.mobileSearchBtn}
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Open search"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Right */}
    <div className={styles.right}>

        {/* Profile */}
        <div className={styles.profile} ref={profileRef}>
          <button
            className={styles.profileTrigger}
            onClick={() => setProfileOpen(!profileOpen)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            <div className={styles.avatar}>
              <User size={20} />
            </div>

            <div className={styles.info}>
              <h4>Admin</h4>
              <p>Administrator</p>
            </div>

            <ChevronDown
              size={18}
              className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ""}`}
            />
          </button>

          {/* Dropdown */}
          <div
            className={`${styles.dropdown} ${profileOpen ? styles.show : ""}`}
          >
            <button onClick={() => setProfileOpen(false)}>
              <User size={18} />
              Profile
            </button>

            <button onClick={() => setProfileOpen(false)}>
              <Settings size={18} />
              Settings
            </button>

            <button
              className={styles.logout}
              onClick={() => setProfileOpen(false)}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <div
        className={`${styles.mobileSearchOverlay} ${
          mobileSearchOpen ? styles.show : ""
        }`}
      >
        <div className={styles.mobileSearchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            autoFocus={mobileSearchOpen}
          />
        </div>
        <button
          className={styles.mobileSearchClose}
          onClick={() => setMobileSearchOpen(false)}
          aria-label="Close search"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}
