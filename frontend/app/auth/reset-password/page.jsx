"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ResetPassword.module.css";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("Password reset token is missing. Please request a new link.");
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Password reset successful! Logging you in...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } else {
      setErrorMsg(result.message || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1>Reset Password</h1>

        <p>Create a new password for your account.</p>
      </div>

      {errorMsg && (
        <div style={{
          padding: "10px 14px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fee2e2",
          color: "#b91c1c",
          borderRadius: "6px",
          fontSize: "14px",
          marginBottom: "16px"
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
          marginBottom: "16px"
        }}>
          {successMsg}
        </div>
      )}

      {!token ? (
        <div style={{ margin: "20px 0", textAlign: "center", color: "#ef4444" }}>
          <p>No valid reset token found in URL.</p>
          <Link href="/auth/forgot-password" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: "bold" }}>
            Request new reset link
          </Link>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>New Password</label>

            <div className={styles.inputBox}>
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <div className={styles.footer}>
        Remember your password?

        <Link href="/auth/login">
          Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className={styles.container}>
      <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /> Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </section>
  );
}