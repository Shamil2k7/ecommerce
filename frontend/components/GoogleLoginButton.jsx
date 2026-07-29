"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./GoogleLoginButton.module.css";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "938827461023-dummyclientid.apps.googleusercontent.com";

export default function GoogleLoginButton() {
  const { googleLogin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkScript = () => {
      if (window.google?.accounts) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkScript()) return;

    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      const container = document.getElementById("google-signin-btn-container");
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    } catch (err) {
      console.error("Google button initialization failed:", err);
    }
  }, [isLoaded]);

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) return;

    setLoading(true);
    setError("");

    try {
      const res = await googleLogin(response.credential);
      if (res?.success) {
        window.location.reload();
      } else {
        setError(res?.message || "Authentication failed");
      }
    } catch (err) {
      setError("An error occurred during Google sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackClick = () => {
    toast.error(
      "Google Sign-In is unavailable. Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set in your .env file."
    );
  };

  return (
    <div className={styles.wrapper}>
      {error && <div className={styles.errorText}>{error}</div>}

      {loading && (
        <div className={styles.spinnerWrapper}>
          <Loader2 className={styles.spin} size={20} />
          <span>Connecting...</span>
        </div>
      )}

      <div
        id="google-signin-btn-container"
        className={styles.googleContainer}
        style={{ display: isLoaded && !loading ? "block" : "none" }}
      />

      {!isLoaded && !loading && (
        <button
          type="button"
          onClick={handleFallbackClick}
          className={styles.fallbackButton}
        >
          <svg
            className={styles.googleIcon}
            viewBox="0 0 24 24"
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span className={styles.btnText}>Continue with Google</span>
        </button>
      )}
    </div>
  );
}
