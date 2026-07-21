"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./navbar/navbar";
import Footer from "./Footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const hideLayout =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/staff");

  const protectedUserRoutes = ["/profile", "/orders", "/checkout", "/wishlist"];
  const isUserRoute = protectedUserRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (!loading) {
      if (isAdminRoute) {
        if (!user) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (user.role !== "admin") {
          router.replace("/");
        }
      } else if (isUserRoute) {
        if (!user) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    }
  }, [user, loading, pathname, isUserRoute, isAdminRoute, router]);

  const needsAuth = isUserRoute || isAdminRoute;
  if (needsAuth && (loading || !user || (isAdminRoute && user.role !== "admin"))) {
    if (loading) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#f9fafb",
          fontFamily: "var(--font-inter), sans-serif",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e1e8ed",
            borderTopColor: "#4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "16px",
          }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
          <p style={{ color: "#4f46e5", fontWeight: "600", fontSize: "14px" }}>Verifying credentials...</p>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {!hideLayout && <Navbar />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}