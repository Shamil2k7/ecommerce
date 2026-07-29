"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP & Email Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Validation Error States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const { register, sendRegistrationOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const countries = [
    { name: "India", code: "+91" },
    { name: "United States", code: "+1" },
    { name: "United Kingdom", code: "+44" },
    { name: "Australia", code: "+61" },
    { name: "United Arab Emirates", code: "+971" },
    { name: "South Korea", code: "+82" },
    { name: "Japan", code: "+81" },
    { name: "Germany", code: "+49" },
    { name: "France", code: "+33" }
  ];

  const handleSendOtp = async () => {
    setEmailError("");
    setOtpError("");
    setErrorMsg("");

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    const result = await sendRegistrationOtp(email.trim());
    setSendingOtp(false);

    if (result.success) {
      setOtpSent(true);
      setSuccessMsg("OTP sent to your email.");
    } else {
      setEmailError(result.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setErrorMsg("");

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    const result = await verifyOtp(email.trim(), otpInput.trim());
    setVerifyingOtp(false);

    if (result.success) {
      setIsEmailVerified(true);
      setSuccessMsg("Email verified successfully.");
      setOtpError("");
    } else {
      setOtpError(result.message || "Invalid or expired OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    if (!isEmailVerified) {
      setErrorMsg("Please verify your email before creating an account.");
      return;
    }

    let isValid = true;

    if (!fullName.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setPhoneError("Please enter a valid phone number (10-15 digits)");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain both letters and numbers");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!termsAccepted) {
      setTermsError("You must accept the Terms & Conditions");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    const fullPhoneNumber = countryCode + digitsOnly;
    const result = await register(fullName, email, fullPhoneNumber, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(result.message || "Registration failed. Please try again.");
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
            <h1>Create Account</h1>
            <p>Register to start shopping</p>
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
                <User size={18} />
                <input
                  type="text"
                  id="fullName"
                  placeholder=" "
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  required
                />
                <label htmlFor="fullName" className={styles.floatingLabel}>Full Name</label>
              </div>
              {nameError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {nameError}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.inputBox}>
                <Mail size={18} />
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  disabled={isEmailVerified}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (isEmailVerified) setIsEmailVerified(false);
                    if (otpSent) setOtpSent(false);
                  }}
                  required
                />
                <label htmlFor="email" className={styles.floatingLabel}>Email Address</label>

                {isEmailVerified ? (
                  <span className={styles.verifiedBadge}>Verified ✓</span>
                ) : (
                  <button
                    type="button"
                    className={styles.verifyBtn}
                    disabled={sendingOtp || !email.trim()}
                    onClick={handleSendOtp}
                  >
                    {sendingOtp ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : otpSent ? (
                      "Resend"
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </div>
              {emailError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {emailError}
                </span>
              )}
            </div>

            {otpSent && !isEmailVerified && (
              <div className={styles.field}>
                <div className={styles.inputBox}>
                  <Lock size={18} />
                  <input
                    type="text"
                    id="otpInput"
                    placeholder=" "
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, ""));
                      if (otpError) setOtpError("");
                    }}
                  />
                  <label htmlFor="otpInput" className={styles.floatingLabel}>Enter 6-Digit OTP</label>

                  <button
                    type="button"
                    className={styles.verifyOtpBtn}
                    disabled={verifyingOtp || otpInput.trim().length !== 6}
                    onClick={handleVerifyOtp}
                  >
                    {verifyingOtp ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
                {otpError && (
                  <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                    {otpError}
                  </span>
                )}
              </div>
            )}

            <div className={styles.field}>
              <div className={styles.inputBox}>
                <Phone size={18} />

                <div className={styles.countryDropdownContainer}>
                  <div
                    className={styles.selectedDisplay}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>{countryCode}</span>
                    <ChevronDown size={14} />
                  </div>

                  {dropdownOpen && (
                    <div className={styles.dropdownOptions}>
                      {countries.map((c) => (
                        <div
                          key={c.name}
                          className={styles.optionItem}
                          onClick={() => {
                            setCountryCode(c.code);
                            setDropdownOpen(false);
                          }}
                        >
                          {c.name} ({c.code})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  id="phone"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                    if (phoneError) setPhoneError("");
                  }}
                  required
                  style={{ paddingLeft: "8px" }}
                />
                <label htmlFor="phone" className={styles.mobileFloatingLabel}>Phone Number</label>
              </div>
              {phoneError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {phoneError}
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

            <div className={styles.field}>
              <div className={styles.inputBox}>
                <Lock size={18} />

                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  required
                />
                <label htmlFor="confirmPassword" className={styles.floatingLabel}>Confirm Password</label>

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
              {confirmPasswordError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {confirmPasswordError}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (termsError) setTermsError("");
                  }}
                />
                I agree to the Terms & Conditions and Privacy Policy.
              </label>
              {termsError && (
                <span style={{ color: "#b91c1c", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "left" }}>
                  {termsError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.registerBtn}
              disabled={loading || !isEmailVerified}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: loading || !isEmailVerified ? 0.7 : 1,
                cursor: loading || !isEmailVerified ? "not-allowed" : "pointer"
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating Account..." : !isEmailVerified ? "Verify Email to Continue" : "Create Account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0", color: "var(--text-soft)", fontSize: "14px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--line)" }}></div>
            <span style={{ padding: "0 10px" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--line)" }}></div>
          </div>

          <GoogleLoginButton />

          <div className={styles.footer}>
            Already have an account?

            <Link href="/auth/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}