"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topbar}>
        Extra 10% OFF on ICICI Cards • Free Delivery Above ₹999
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* Top row elements (Logo left, Hamburger right on mobile) */}
          <div className={styles.topRow}>
            {/* Logo */}
            <Link href="/" className={styles.logo} onClick={closeMenu}>
              <span className={styles.dot}></span>
              ShopAura
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>

          {/* Search Bar Row (Stacks completely under Logo/Hamburger on mobile) */}
          <div className={styles.searchRow}>
            <div className={styles.search}>
              <IoSearchOutline className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for Products"
              />
            </div>
            <Link href="/wishlist" className={styles.mobileWishlist} onClick={closeMenu}>
              <CiHeart />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
          </nav>

          {/* Desktop Actions/Icons Bar */}
          <div className={styles.icons}>
            <Link href="/profile" title="Profile">
              <CgProfile />
            </Link>

            <Link href="/wishlist" title="Wishlist">
              <CiHeart />
            </Link>

            <Link href="/cart" className={styles.cart} title="Cart">
              <IoCartOutline />
              <span className={styles.badge}>0</span>
            </Link>
          </div>
        </div>

        {/* Backdrop overlay */}
        <div 
          className={`${styles.overlay} ${menuOpen ? styles.show : ""}`} 
          onClick={closeMenu}
        />

        {/* Mobile Navigation Drawer */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.show : ""}`}>
          
          {/* Drawer Close Button */}
          <button 
            className={styles.closeBtn} 
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            ✕
          </button>

          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/products" onClick={closeMenu}>Products</Link>
          <Link href="/categories" onClick={closeMenu}>Categories</Link>
          <Link href="/contact" onClick={closeMenu}>Contact</Link>
          
          <hr style={{ border: "0", borderTop: "1px solid var(--line)", margin: "10px 0" }} />
          
          {/* Profile Icon Menu Item for Mobile Viewport */}
          <Link href="/profile" className={styles.mobileMenuIconLink} onClick={closeMenu}>
            <CgProfile style={{ fontSize: "22px" }} /> Profile
          </Link>
          
          <Link href="/wishlist" onClick={closeMenu}>Wishlist</Link>
          <Link href="/cart" onClick={closeMenu}>Cart</Link>
        </div>
      </header>
    </>
  );
}