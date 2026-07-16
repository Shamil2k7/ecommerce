"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import styles from "./Register.module.css";

const countries = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownOpen && !e.target.closest(`.${styles.countrySelector}`)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || !email || !phone || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 12) {
      setErrorMsg(`Please enter a valid phone number for ${selectedCountry.name} (7-12 digits)`);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    if (!termsAccepted) {
      setErrorMsg("You must accept the Terms & Conditions");
      return;
    }

    // Store complete phone number with selected country code
    const fullPhone = selectedCountry.code + digitsOnly;

    setLoading(true);
    const result = await register(fullName, email, fullPhone, password);
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
          <div className={styles.header}>
            <h1>Create Account</h1>
            <p>Register to start shopping with ShopAura.</p>
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Full Name</label>

              <div className={styles.inputBox}>
                <User size={18} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className={styles.field}>
              <label>Phone Number</label>

              <div className={styles.inputBox}>
                <Phone size={18} />
                
                <div className={styles.countrySelector}>
                  <button
                    type="button"
                    className={styles.countryBtn}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>{selectedCountry.flag} {selectedCountry.code}</span>
                    <span className={styles.dropdownArrow}>▼</span>
                  </button>
                  
                  {dropdownOpen && (
                    <div className={styles.countryDropdown}>
                      {countries.map((c) => (
                        <div
                          key={c.code + c.name}
                          className={styles.countryItem}
                          onClick={() => {
                            setSelectedCountry(c);
                            setDropdownOpen(false);
                          }}
                        >
                          <span className={styles.dropdownFlag}>{c.flag}</span>
                          <span className={styles.dropdownName}>{c.name}</span>
                          <span className={styles.dropdownCode}>{c.code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className={styles.divider}>|</span>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className={styles.phoneInputVal}
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                  }}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Password</label>

              <div className={styles.inputBox}>
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
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
                  placeholder="Confirm password"
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

            <label className={styles.checkbox}>
              <input 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              I agree to the Terms & Conditions and Privacy Policy.
            </label>

            <button
              type="submit"
              className={styles.registerBtn}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0", color: "var(--text-soft)", fontSize: "14px" }}>
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

        <div className={styles.imageSection}>
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800" 
            alt="ShopAura SignUp" 
            className={styles.sideImage}
          />
        </div>
      </div>
    </section>
  );
}