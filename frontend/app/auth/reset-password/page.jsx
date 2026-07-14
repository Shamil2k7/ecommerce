"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import styles from "./ResetPassword.module.css";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Reset Password</h1>

          <p>Create a new password for your account.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label>New Password</label>

            <div className={styles.inputBox}>
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
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

          <button
            type="submit"
            className={styles.resetBtn}
          >
            Reset Password
          </button>
        </form>

        <div className={styles.footer}>
          Remember your password?

          <Link href="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}