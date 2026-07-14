"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminSidebar.module.css";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Shapes,
  TicketPercent,
  Percent,
  Image,
  Star,
  Bell,
  User,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/staff",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    href: "/staff/products",
  },
  {
    title: "Categories",
    icon: Shapes,
    href: "/staff/categories",
  },
  {
    title: "Orders",
    icon: Package,
    href: "/staff/orders",
  },
  {
    title: "Coupons",
    icon: TicketPercent,
    href: "/staff/coupons",
  },
  {
    title: "Offers",
    icon: Percent,
    href: "/staff/offers",
  },
  {
    title: "Banners",
    icon: Image,
    href: "/staff/banners",
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/staff/reviews",
  },
 
  {
    title: "Profile",
    icon: User,
    href: "/staff/profile",
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}

      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>

        <div>
          <h2>ShopAura</h2>
          <p>Staff Panel</p>
        </div>
      </div>

      {/* Navigation */}

      <nav className={styles.nav}>
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

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