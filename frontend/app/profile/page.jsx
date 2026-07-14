"use client";

import { useState } from "react";
import {
  User,
  ShoppingBag,
  Heart,
  Lock,
  LogOut,
  Camera,
} from "lucide-react";

import styles from "./Profile.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Smith",
    email: "john@gmail.com",
    phone: "+91 9876543210",
    address: "Kochi, Kerala",
    image: "/profile.jpg",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setUser({
        ...user,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <section className={styles.container}>
      {/* Sidebar */}

      <aside className={styles.sidebar}>
        <label className={styles.avatar}>
          <img src={user.image} alt="Profile" />

          <div className={styles.overlay}>
            <Camera size={20} />
          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </label>

        <h2>{user.name}</h2>

        <p>{user.email}</p>

        <nav className={styles.menu}>
          <a className={styles.active}>
            <User size={18} />
            Profile
          </a>

          <a href="/orders">
            <ShoppingBag size={18} />
            My Orders
          </a>

          <a href="/wishlist">
            <Heart size={18} />
            Wishlist
          </a>

          <a href="/auth/change-password">
            <Lock size={18} />
            Change Password
          </a>

          <a>
            <LogOut size={18} />
            Logout
          </a>
        </nav>
      </aside>

      {/* Content */}

      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Personal Information</h2>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Full Name</label>

              <input
                value={user.name}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Phone</label>

              <input
                value={user.phone}
                onChange={(e) =>
                  setUser({
                    ...user,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Address</label>

              <input
                value={user.address}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button className={styles.save}>
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
}