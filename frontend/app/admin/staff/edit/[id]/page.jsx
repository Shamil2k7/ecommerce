"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import styles from "../../add/AddStaff.module.css";

export default function EditStaffPage() {
  const [staff, setStaff] = useState({
    image: "https://i.pravatar.cc/300?img=12",
    name: "John Smith",
    email: "john@gmail.com",
    phone: "+91 9876543210",
    password: "",
    role: "Administrator",
    department: "Management",
    address: "Kochi, Kerala",
    status: "Active",
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
        <div>
          <Link href="/admin/staff" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Staff
          </Link>

          <h1>Edit Staff</h1>
          <p>Update staff information</p>
        </div>
      </div>

      <form className={styles.grid}>
        {/* Left Side */}

        <div className={styles.card}>
          <h3>Staff Information</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name</label>

              <input
                value={staff.name}
                onChange={(e) =>
                  setStaff({ ...staff, name: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                type="email"
                value={staff.email}
                onChange={(e) =>
                  setStaff({ ...staff, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Phone</label>

              <input
                value={staff.phone}
                onChange={(e) =>
                  setStaff({ ...staff, phone: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>

              <input
                type="password"
                placeholder="Leave blank to keep current password"
                onChange={(e) =>
                  setStaff({ ...staff, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Role</label>

              <select
                value={staff.role}
                onChange={(e) =>
                  setStaff({ ...staff, role: e.target.value })
                }
              >
                <option>Administrator</option>
                <option>Manager</option>
                <option>Sales</option>
                <option>Support</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Department</label>

              <input
                value={staff.department}
                onChange={(e) =>
                  setStaff({
                    ...staff,
                    department: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.field}>
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
        </div>

        {/* Right Side */}

        <div>
          <div className={styles.card}>
            <h3>Profile Photo</h3>

            <label className={styles.upload}>
              <img src={staff.image} alt="Staff" />

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

              <div className={styles.overlay}>
                <Upload size={24} />
                Change Photo
              </div>
            </label>
          </div>

          <div className={styles.card}>
            <h3>Status</h3>

            <select
              value={staff.status}
              onChange={(e) =>
                setStaff({
                  ...staff,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.deleteBtn}
            >
              <Trash2 size={18} />
              Delete
            </button>

            <button
              type="button"
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Update Staff
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}