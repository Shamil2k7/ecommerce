"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// Base URL for all auth API calls
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if the user is logged in on every page load
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed to send the JWT cookie cross-origin
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);

      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (fullName, email, phone, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phone, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(null);
        router.push("/auth/login");
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Logout failed" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { 
          success: true, 
          message: data.message,
          token: data.token 
        };
      } else {
        return { success: false, message: data.message || "Failed to send reset link" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message, token: data.token };
      } else {
        return { success: false, message: data.message || "Invalid or expired OTP" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const resetPassword = async (email, token, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Failed to reset password" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Failed to change password" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred" };
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message , user: data.user};
      } else {
        return { success: false, message: data.message || "Google authentication failed" };
      }
    } catch (error) {
      return { success: false, message: error.message || "An error occurred during Google Auth" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        changePassword,
        googleLogin,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
