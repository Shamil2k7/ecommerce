import { Inter } from "next/font/google";
import "./globals.css";

import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export async function generateMetadata() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/settings`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    const settings = data.settings;

    return {
      title: settings.storeName,
      description: settings.tagline,
      icons: {
        icon: settings.favicon,
      },
    };
  } catch (error) {
    return {
      title: "ShopAura",
      description: "E-Commerce Website",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <body>
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}