"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./AddStaff.module.css";

export default function AddStaffPage() {
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
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

          <h1>Add Staff</h1>
          <p>Create a new staff account</p>
        </div>
      </div>

      <form className={styles.grid}>
        {/* Left Side */}

        <div className={styles.card}>
          <h3>Staff Information</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" placeholder="John Smith" />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input type="email" placeholder="john@gmail.com" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input type="text" placeholder="+91 9876543210" />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input type="password" placeholder="********" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Role</label>

              <select>
                <option>Administrator</option>
                <option>Manager</option>
                <option>Sales</option>
                <option>Support</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Department</label>

              <input type="text" placeholder="Sales Department" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Address</label>

            <textarea
              rows="4"
              placeholder="Enter address..."
            />
          </div>
        </div>

        {/* Right Side */}

        <div>
          <div className={styles.card}>
            <h3>Profile Photo</h3>

            <label className={styles.upload}>
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <>
                  <Upload size={42} />
                  <span>Upload Photo</span>
                </>
              )}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>

          <div className={styles.card}>
            <h3>Status</h3>

            <select>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className={styles.actions}>
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
              Save Staff
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}