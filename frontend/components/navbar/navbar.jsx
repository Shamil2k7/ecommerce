"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import Image from "next/image";

export default function Navbar() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  console.log(API, 'navbaaaarr');
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

  const [menuOpen, setMenuOpen] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "ShopAura",
    tagline: "",
    logo: "",
    favicon: "",
  });

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/api/settings`);
      console.log('hhhhhhhhhhhhhhhhhh')
      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If using Cloudinary URLs, use settings.logo directly.
  // If using local uploads, prefix with API.
  const logoSrc = settings.logo
    ? settings.logo.startsWith("http")
      ? settings.logo
      : `${API}${settings.logo}`
    : "";

  return (
    <>
      <div className={styles.topbar}>
        Extra 10% OFF on ICICI Cards • Free Delivery Above ₹999
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <Link href="/" className={styles.logo} onClick={closeMenu}>
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={settings.storeName}
                  width={52}
                  height={52}
                  className={styles.logoImage}
                  priority
                />
              ) : (
                <span className={styles.dot}></span>
              )}

              <div className={styles.logoText}>
                <h2>{settings.storeName}</h2>
                {settings.tagline && <p>{settings.tagline}</p>}
              </div>
            </Link>

            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

       <div className={styles.searchRow}>
  <div className={styles.search}>
    <IoSearchOutline className={styles.searchIcon} />
    <input type="text" placeholder="Search for Products" />
  </div>

  <div className={styles.mobileIcons}>
    <Link
      href="/wishlist"
      className={styles.mobileWishlist}
      onClick={closeMenu}
    >
      <CiHeart />
    </Link>

    <Link
      href="/cart"
      className={styles.mobileCart}
      onClick={closeMenu}
    >
      <IoCartOutline />
      <span className={styles.badge}>0</span>
    </Link>
  </div>
</div>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
          </nav>

          <div className={styles.icons}>
            <Link href="/profile">
              <CgProfile />
            </Link>

            <Link href="/wishlist">
              <CiHeart />
            </Link>

            <Link href="/cart" className={styles.cart}>
              <IoCartOutline />
              <span className={styles.badge}>0</span>
            </Link>
          </div>
        </div>

        <div
          className={`${styles.overlay} ${menuOpen ? styles.show : ""}`}
          onClick={closeMenu}
        />

        <div className={`${styles.mobileMenu} ${menuOpen ? styles.show : ""}`}>
          <button className={styles.closeBtn} onClick={closeMenu}>
            ✕
          </button>

          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/products" onClick={closeMenu}>
            Products
          </Link>

          <Link href="/categories" onClick={closeMenu}>
            Categories
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <hr />

          <Link
            href="/profile"
            className={styles.mobileMenuIconLink}
            onClick={closeMenu}
          >
            <CgProfile /> Profile
          </Link>

          <Link href="/wishlist" onClick={closeMenu}>
            Wishlist
          </Link>

          <Link href="/cart" onClick={closeMenu}>
            Cart
          </Link>
        </div>
      </header>
    </>
  );
}
