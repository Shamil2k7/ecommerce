"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ChangePassword.module.css";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { changePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } else {
      setErrorMsg(result.message || "Failed to change password. Please check your current password.");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Change Password</h1>
        <p>Update your account password.</p>
      </div>

      {errorMsg && (
        <div style={{
          padding: "10px 14px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fee2e2",
          color: "#b91c1c",
          borderRadius: "6px",
          fontSize: "14px",
          marginBottom: "16px",
          maxWidth: "500px",
          margin: "0 auto 16px auto"
        }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{
          padding: "10px 14px",
          backgroundColor: "#f0fdf4",
          border: "1px solid #dcfce7",
          color: "#15803d",
          borderRadius: "6px",
          fontSize: "14px",
          marginBottom: "16px",
          maxWidth: "500px",
          margin: "0 auto 16px auto"
        }}>
          {successMsg}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Current Password</label>

          <div className={styles.passwordBox}>
            <Lock size={18} />

            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
            type="button"
            className={styles.cancel}
            onClick={() => router.back()}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.save}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </section>
  );
}