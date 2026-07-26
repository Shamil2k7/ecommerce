"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./Footer.module.css";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/api/settings`);

      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* About */}

        <div className={styles.column}>
          <h4>ABOUT</h4>

          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/about">About Us</Link></li>

          </ul>
        </div>

        {/* Shop */}

        <div className={styles.column}>
          <h4>SHOP</h4>

          <ul>
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/cart">Cart</Link></li>
        
          </ul>
        </div>

        {/* Help */}

        <div className={styles.column}>
          <h4>HELP</h4>

          <ul>
            <li><Link href="/payments">Payments</Link></li>
            <li><Link href="/shipping">Shipping</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            
          </ul>
        </div>

        {/* Policies */}

        <div className={styles.column}>
          <h4>POLICIES</h4>

          <ul>
            <li><Link href="/policies#privacy">Privacy Policy</Link></li>
            <li><Link href="/policies#terms">Terms & Conditions</Link></li>
            <li><Link href="/policies#refund">Refund Policy</Link></li>
            <li><Link href="/policies#cookies">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Mail */}

        <div className={`${styles.column} ${styles.borderLeft}`}>
          <h4>MAIL US</h4>

          <div className={styles.contact}>
            {settings?.email && <p>{settings.email}</p>}
            {settings?.phone && <p>{settings.phone}</p>}
          </div>

          <h4 className={styles.socialTitle}>SOCIAL</h4>

          <div className={styles.social}>
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
            )}

            {settings?.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            )}

            {settings?.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            )}

            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>

        {/* Address */}

        <div className={styles.column}>
          <h4>REGISTERED OFFICE ADDRESS</h4>

          <div className={styles.contact}>
            <p>{settings?.storeName}</p>

            {settings?.address
              ?.split("\n")
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}

            {settings?.phone && (
              <p className={styles.phone}>
                Phone : {settings.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div>Become a Seller</div>

        <div>Gift Cards</div>

        <div>Help Center</div>

        <div>
          © {new Date().getFullYear()}{" "}
          {settings?.storeName || "ShopAura"}
        </div>

      
      </div>
    </footer>
  );
}