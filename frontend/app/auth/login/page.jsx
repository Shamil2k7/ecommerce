"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(result.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.formSection}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p>Login to continue shopping.</p>
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

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <div className={styles.inputBox}>
                <Mail size={18} />

                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  required
                />
                <label htmlFor="email" className={styles.floatingLabel}>Email Address</label>
              </div>
              {emailError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {emailError}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.inputBox}>
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  required
                />
                <label htmlFor="password" className={styles.floatingLabel}>Password</label>

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
              {passwordError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {passwordError}
                </span>
              )}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0", color: "var(--text-soft)", fontSize: "14px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--line)" }}></div>
            <span style={{ padding: "0 10px" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--line)" }}></div>
          </div>

          <GoogleLoginButton />

          <div className={styles.footer}>
            Don't have an account?

            <Link href="/auth/register">
              Register
            </Link>
          </div>
        </div>

        <div className={styles.imageSection}>
          <img 
            src="https://i.pinimg.com/1200x/89/70/0a/89700ac2584feaede2c609d5340acbaa.jpg" 
            alt="ShopAura SignIn" 
            className={styles.sideImage}
          />
        </div>
      </div>
    </section>
  );
}