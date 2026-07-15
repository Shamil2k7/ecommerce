"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogoutClick = async () => {
    await logout();
  };

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topbar}>
        Extra 10% OFF on ICICI Cards • Free Delivery Above ₹999
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.dot}></span>
            ShopAura
          </Link>

          {/* Search */}
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search products..."
            />
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
          </nav>

          {/* Icons */}
          <div className={styles.icons} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {user ? (
              <>
                <Link href="/profile" title={`Profile: ${user.fullName}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <CgProfile />
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
                      {user.fullName.split(" ")[0]}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#ef4444",
                    padding: "4px 8px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" title="Login">
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <CgProfile />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#4f46e5" }}>
                      Login
                    </span>
                  </div>
                </Link>
              </>
            )}

            <Link href="/wishlist"><CiHeart /></Link>

            <Link href="/cart" className={styles.cart}>
              <IoCartOutline />
              <span className={styles.badge}>0</span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`${styles.mobileMenu} ${
            menuOpen ? styles.show : ""
          }`}
        >
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/contact">Contact</Link>
          {user ? (
            <>
              <Link href="/profile">Profile ({user.fullName})</Link>
              <button 
                onClick={handleLogoutClick}
                style={{ 
                  textAlign: "left", 
                  background: "none", 
                  border: "none", 
                  padding: "10px 0", 
                  color: "#ef4444", 
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login">Login / Register</Link>
          )}
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </header>
    </>
  );
}