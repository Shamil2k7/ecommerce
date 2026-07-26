"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./GoogleLoginButton.module.css";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function GoogleLoginButton() {
  const { googleLogin } = useAuth();
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "938827461023-dummyclientid.apps.googleusercontent.com";

  useEffect(() => {
    let interval;

    // Wait for the Google client script to load
    const checkScript = () => {
      if (window.google?.accounts) {
        setGoogleLoaded(true);
        clearInterval(interval);
      }
    };

    checkScript();
    interval = setInterval(checkScript, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (googleLoaded) {
      initializeButton();
    }
  }, [googleLoaded]);

  // Initializing the Google Sign-In button
  const initializeButton = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn-container"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        }
      );
    } catch (err) {
      console.error("Google button initialization failed:", err);
    }
  };

  // Handling the Google oauth token response
  const handleCredentialResponse = async (response) => {
    if (!response.credential) return;

    setLoading(true);
    setAuthError("");

    try {
      const result = await googleLogin(response.credential);
      if (result.success) {
        window.location.reload();
      } else {
        setAuthError(result.message || "Authentication failed");
      }
    } catch (error) {
      setAuthError("An error occurred during Google sign in");
    } finally {
      setLoading(false);
    }
  };

  // Displaying fallback handler when script is unavailable
  const handleFallbackClick = () => {
    toast.error(
      "Google Sign-In is unavailable. Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set in your .env file."
    );
  };

  return (
    <div className={styles.wrapper}>
      {authError && <div className={styles.errorText}>{authError}</div>}

      {loading && (
        <div className={styles.spinnerWrapper}>
          <Loader2 className={styles.spin} size={20} />
          <span>Connecting...</span>
        </div>
      )}

      <div
        id="google-signin-btn-container"
        className={styles.googleContainer}
        style={{ display: googleLoaded && !loading ? "block" : "none" }}
      />

      {!googleLoaded && !loading && (
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
