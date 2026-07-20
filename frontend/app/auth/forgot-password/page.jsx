"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ForgotPassword.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devToken, setDevToken] = useState("");

  const { forgotPassword } = useAuth();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setDevToken("");

    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("A password reset link has been dispatched to your email address! Please check your inbox.");
      if (result.token) {
        setDevToken(result.token);
      }
    } else {
      setErrorMsg(result.message || "Failed to submit recovery request");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <Link href="/" className={styles.backHome}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div className={styles.header}>
          <h1>Forgot Password?</h1>
          <p>
            Enter your registered email address below, and we will send you a secure link to reset your account password.
          </p>
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
            <p style={{ margin: 0 }}>{successMsg}</p>
            
            {devToken && (
              <div style={{ marginTop: "14px", padding: "10px", backgroundColor: "#fff", border: "1px dashed #22c55e", borderRadius: "6px", fontSize: "13px", color: "#374151" }}>
                <strong>[Dev Token Link]:</strong><br />
                <a 
                  href={`/auth/reset-password?token=${devToken}&email=${encodeURIComponent(email)}`}
                  style={{ color: "#4f46e5", textDecoration: "underline", wordBreak: "break-all", display: "inline-block", marginTop: "4px" }}
                >
                  /auth/reset-password?token=${devToken.substring(0, 12)}...
                </a>
              </div>
            )}
          </div>
        )}

        {!successMsg && (
          <form className={styles.form} onSubmit={handleSendEmail} noValidate>
            <div className={styles.field}>
              <label>Email Address</label>
              <div className={styles.inputBox}>
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          Remember your password?
          <Link href="/auth/login" style={{ marginLeft: "6px", color: "var(--primary)", fontWeight: "600" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}