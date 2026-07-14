"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import styles from "./ForgotPassword.module.css";

export default function ForgotPasswordPage() {
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we'll send you a password reset link.
          </p>
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

          <button
            type="submit"
            className={styles.resetBtn}
          >
            Send Reset Link
          </button>
        </form>

        <div className={styles.footer}>
          Remember your password?

          <Link href="/auth/login">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}