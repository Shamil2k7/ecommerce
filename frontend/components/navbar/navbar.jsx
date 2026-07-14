"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className={styles.icons}>
            <Link href="/profile"><CgProfile /></Link>

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
          <Link href="/profile">Profile</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </header>
    </>
  );
}