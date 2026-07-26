"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ForgotPassword.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { forgotPassword } = useAuth();
  const router = useRouter();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

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
      setSuccessMsg("OTP has been sent to your registered email.");

      setTimeout(() => {
        router.push(
          `/auth/verify-otp?email=${encodeURIComponent(email)}`
        );
      }, 1000);
    } else {
      setErrorMsg(result.message || "Failed to send OTP");
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
            Enter your registered email address to receive a
            verification OTP.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#b91c1c",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #dcfce7",
              color: "#15803d",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {successMsg}
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={handleSendOtp}
          noValidate
        >
          <div className={styles.field}>
            <label>Email Address</label>

            <div className={styles.inputBox}>
              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className={styles.footer}>
          Remember your password?

          <Link
            href="/auth/login"
            style={{
              marginLeft: "6px",
              color: "var(--primary)",
              fontWeight: "600",
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}