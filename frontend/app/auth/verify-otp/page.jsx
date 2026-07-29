"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./VerifyOtp.module.css";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const { verifyOtp, forgotPassword } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const values = pasted.split("");
    const newOtp = [...otp];

    values.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (timeLeft <= 0) {
      setErrorMsg("OTP has expired. Please request a new OTP.");
      return;
    }

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    const result = await verifyOtp(email, otpCode);

    setLoading(false);

    if (result.success) {
      setSuccessMsg("OTP verified successfully.");

      setTimeout(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otpCode}`
        );
      }, 1200);
    } else {
      setErrorMsg(result.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    setResending(true);

    const result = await forgotPassword(email);

    setResending(false);

    if (result.success) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setSuccessMsg("A new OTP has been sent to your email.");
      document.getElementById("otp-0")?.focus();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <Link href="/auth/login" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </Link>

        <div className={styles.header}>
          <div className={styles.icon}>
            <ShieldCheck size={36} />
          </div>
          <h1>Verify OTP</h1>
          <p>We sent a 6-digit verification code to</p>
          <strong>{email || "your registered email"}</strong>
        </div>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        <form onSubmit={handleVerify}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.verifyBtn}
            disabled={loading}
          >
            {loading && <Loader2 size={16} className={styles.spinner} />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Didn't receive code? Resend in{" "}
            <strong>
              {minutes}:{seconds}
            </strong>
          </p>
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={resending || timeLeft > 0}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
