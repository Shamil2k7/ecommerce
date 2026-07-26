"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  IoMenu,
  IoClose,
  IoSearchOutline,
  IoCartOutline,
} from "react-icons/io5";

import { CiHeart, CiUser } from "react-icons/ci";

export default function Navbar() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [menuOpen, setMenuOpen] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "",
    tagline: "",
    logo: "",
  });
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch(`${API}/api/settings`);
      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);
  const logoSrc = settings.logo
    ? settings.logo.startsWith("http")
      ? settings.logo
      : `${API}${settings.logo}`
    : "";
  const searchProducts = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/products/search?q=${encodeURIComponent(value)}&limit=5`
      );

      const data = await res.json();

      if (data.success) {
        setSuggestions(data.data.products);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Mobile Menu Button */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(true)}
          >
            <IoMenu />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            {logoSrc &&
              <Image
                src={logoSrc}
                alt={settings.storeName}
                width={42}
                height={42}
                className={styles.logoImage}
                priority
              />
            }

            <div className={styles.logoText}>
              <h2>{settings.storeName}</h2>
              {settings.tagline && <p>{settings.tagline}</p>}
            </div>
          </Link>

          {/* Search */}
          <div className={styles.search} ref={searchRef}>
            <IoSearchOutline className={styles.searchIcon} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => searchProducts(e.target.value)}
              onFocus={() => {
                if (suggestions.length) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/products?search=${search}`);
                  setShowSuggestions(false);
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    href={`/products/${item._id}`}
                    className={styles.suggestionItem}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearch("");
                    }}
                  >
                    <Image
                      src={item.images?.[0]?.url || "/images/no-image.png"}
                      width={40}
                      height={40}
                      alt={item.name}
                    />

                    <div>
                      <p>{item.name}</p>
                      <small>₹{item.price}</small>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Icons */}
          <div className={styles.icons}>
            <Link href="/profile" className={styles.iconItem}>
              <CiUser />
            </Link>

            <Link href="/wishlist" className={styles.iconItem}>
              <CiHeart />
            </Link>

            <Link href="/cart" className={styles.iconItem}>
              <div className={styles.cart}>
                <IoCartOutline />
                <span className={styles.badge}>0</span>
              </div>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className={styles.mobileIcons}>
            <Link href="/wishlist">
              <CiHeart />
            </Link>

            <Link href="/cart" className={styles.mobileCart}>
              <IoCartOutline />
              <span className={styles.badge}>0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`${styles.overlay} ${menuOpen ? styles.show : ""
            }`}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={`${styles.sidebar} ${menuOpen ? styles.show : ""
            }`}
        >
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
          >
            <IoClose />
          </button>

          <div className={styles.sidebarLogo}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={settings.storeName}
                width={50}
                height={50}
                className={styles.logoImage}
              />
            ) : (
              <div className={styles.logoMark}>S</div>
            )}

            <h3>{settings.storeName}</h3>
          </div>

          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          <Link href="/profile" onClick={() => setMenuOpen(false)}>
            My Profile
          </Link>

          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>

          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>

          <Link href="/orders" onClick={() => setMenuOpen(false)}>
            Orders
          </Link>

          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </aside>
      </header>
    </>
  );
}