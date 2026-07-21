import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ShopAura",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body>
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </AuthProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}