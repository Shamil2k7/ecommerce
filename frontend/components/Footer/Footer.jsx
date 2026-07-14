"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}

        <div className={styles.about}>
          <h2>ShopAura</h2>

          <p>
            Shop the latest fashion, electronics, accessories and more.
            Premium quality products with fast delivery.
          </p>

          <div className={styles.social}>
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Shop */}

        <div>
          <h3>Shop</h3>

          <ul>
            <li>
              <Link href="/products">All Products</Link>
            </li>

            <li>
              <Link href="/categories">Categories</Link>
            </li>

            <li>
              <Link href="/wishlist">Wishlist</Link>
            </li>

            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        {/* Support */}

        <div>
          <h3>Support</h3>

          <ul>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>

            <li>
              <Link href="/about">About Us</Link>
            </li>

            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>

            <li>
              <Link href="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}

        <div>
          <h3>Contact</h3>

          <ul className={styles.contact}>
            <li>Email: support@shopaura.com</li>
            <li>Phone: +91 9876543210</li>
            <li>Kochi, Kerala, India</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} ShopAura. All Rights Reserved.
      </div>
    </footer>
  );
}