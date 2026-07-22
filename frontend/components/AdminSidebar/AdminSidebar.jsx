"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BanknoteArrowDown,
  ShieldHalf,
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingCart,
  Users,
  TicketPercent,
  Image,
  Star,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import styles from "./AdminSidebar.module.css";

const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: Shapes },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Refunds", href: "/admin/refunds", icon: BanknoteArrowDown },
  { title: "Brands", href: "/admin/brands", icon: ShieldHalf },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Staff", href: "/admin/staff", icon: Users },
  { title: "Coupons", href: "/admin/coupons", icon: TicketPercent },

  {
    title: "Banners",
    icon: Image,
    children: [
      {
        title: "All Banners",
        href: "/admin/banners",
      },
      {
        title: "Hero Sections",
        href: "/admin/HeroSection",
      },
    ],
  },

  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const [bannerOpen, setBannerOpen] = useState(
    pathname.startsWith("/admin/banners") ||
    pathname.startsWith("/admin/HeroSection")
  );

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <p>Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const parentActive =
              pathname.startsWith("/admin/banners") ||
              pathname.startsWith("/admin/HeroSection");

            return (
              <div key={item.title}>
                <button
                  type="button"
                  className={`${styles.dropdownBtn} ${parentActive ? styles.active : ""
                    }`}
                  onClick={() => setBannerOpen((prev) => !prev)}
                >
                  <div className={styles.dropdownLeft}>
                    <Icon size={20} />
                    <span>{item.title}</span>
                  </div>

                  {bannerOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {bannerOpen && (
                  <div className={styles.subMenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`${styles.subLink} ${pathname === child.href ? styles.active : ""
                          }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <button className={styles.logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}