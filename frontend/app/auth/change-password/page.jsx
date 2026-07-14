"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import styles from "./ChangePassword.module.css";

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Change Password</h1>
        <p>Update your account password.</p>
      </div>

      <form className={styles.form}>
        <div className={styles.field}>
          <label>Current Password</label>

          <div className={styles.passwordBox}>
            <Lock size={18} />

            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
            />

            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label>New Password</label>

          <div className={styles.passwordBox}>
            <Lock size={18} />

            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>

          <div className={styles.passwordBox}>
            <Lock size={18} />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="reset"
            className={styles.cancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.save}
          >
            Update Password
          </button>
        </div>
      </form>
    </section>
  );
}