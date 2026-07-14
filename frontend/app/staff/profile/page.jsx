"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import styles from "./Profile.module.css";

export default function StaffProfilePage() {
  const [staff, setStaff] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    role: "Staff",
    address: "Kochi, Kerala",
    image: "/profile.png",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setStaff({
        ...staff,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className={styles.card}>
        <div className={styles.profileImage}>
          <img src={staff.image} alt="Profile" />

          <label className={styles.upload}>
            <Camera size={18} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              value={staff.name}
              onChange={(e) =>
                setStaff({
                  ...staff,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={staff.email}
              onChange={(e) =>
                setStaff({
                  ...staff,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Phone</label>
            <input
              type="text"
              value={staff.phone}
              onChange={(e) =>
                setStaff({
                  ...staff,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Role</label>
            <input
              type="text"
              value={staff.role}
              disabled
            />
          </div>

          <div className={styles.fieldFull}>
            <label>Address</label>
            <textarea
              rows="4"
              value={staff.address}
              onChange={(e) =>
                setStaff({
                  ...staff,
                  address: e.target.value,
                })
              }
            />
          </div>

          <button className={styles.saveBtn}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
}