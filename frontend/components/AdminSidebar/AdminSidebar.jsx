"use client";

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
} from "lucide-react";

import styles from "./AdminSidebar.module.css";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Shapes,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
{
    title: "Refunds",
    href: "/admin/refunds",
    icon: BanknoteArrowDown,
  },
  
  
  {
    title: "Brands",
    href: "/admin/brands",
    icon: ShieldHalf,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Staff",
    href: "/admin/staff",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
 
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}

      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>

        <div>
          <h2>ShopAura</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${
                active ? styles.active : ""
              }`}
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