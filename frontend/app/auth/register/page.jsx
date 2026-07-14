"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import styles from "./Register.module.css";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Create Account</h1>
          <p>Register to start shopping with ShopAura.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>

            <div className={styles.inputBox}>
              <User size={18} />
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Email Address</label>

            <div className={styles.inputBox}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>

            <div className={styles.inputBox}>
              <Phone size={18} />
              <input
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Password</label>

            <div className={styles.inputBox}>
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label>Confirm Password</label>

            <div className={styles.inputBox}>
              <Lock size={18} />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <label className={styles.checkbox}>
            <input type="checkbox" />
            I agree to the Terms & Conditions and Privacy Policy.
          </label>

          <button
            type="submit"
            className={styles.registerBtn}
          >
            Create Account
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?

          <Link href="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}