"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ForgotPassword.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devToken, setDevToken] = useState("");

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setDevToken("");

    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("A password reset link has been generated!");
      if (result.token) {
        setDevToken(result.token);
      }
    } else {
      setErrorMsg(result.message || "Failed to initiate password reset");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we'll send you a password reset link.
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
              <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#fff", border: "1px dashed #22c55e", borderRadius: "4px", fontSize: "12px", color: "#374151" }}>
                <strong>[Dev Mode Token]:</strong><br />
                <span style={{ fontSize: "11px", wordBreak: "break-all" }}>{devToken}</span>
                <br />
                <Link 
                  href={`/auth/reset-password?token=${devToken}`}
                  style={{ display: "inline-block", marginTop: "5px", color: "#4f46e5", fontWeight: "bold", textDecoration: "underline" }}
                >
                  Go to reset page directly
                </Link>
              </div>
            )}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
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