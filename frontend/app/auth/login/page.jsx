"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Welcome Back 👋</h1>
          <p>Login to continue shopping.</p>
        </div>

        <form className={styles.form}>
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
            <label>Password</label>

            <div className={styles.inputBox}>
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              Remember Me
            </label>

            <Link href="/auth/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
          >
            Login
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?

          <Link href="/auth/register">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}