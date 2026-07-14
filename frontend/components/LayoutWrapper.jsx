"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
import Footer from "./Footer/Footer";


export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/staff");
    
  return (
    <>
      {!hideLayout && <Navbar/>}

      {children}

      {!hideLayout && <Footer/>}
    </>
  );
}