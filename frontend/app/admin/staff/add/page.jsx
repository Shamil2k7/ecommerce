"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./AddStaff.module.css";

export default function AddStaffPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  const [image, setImage] = useState(null);

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Administrator",
    department: "",
    address: "",
    status: "Active",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !staff.name ||
      !staff.email ||
      !staff.phone ||
      !staff.password
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", staff.name);
      formData.append("email", staff.email);
      formData.append("phone", staff.phone);
      formData.append("password", staff.password);
      formData.append("role", staff.role);
      formData.append("department", staff.department);
      formData.append("address", staff.address);
      formData.append("status", staff.status);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/staff`,
  {
    method: "POST",
    body: formData,
  }
);

      const data = await response.json();

      if (!response.ok) {  
        throw new Error(data.message);
      }

      alert("Staff created successfully.");

      setStaff({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "Administrator",
        department: "",
        address: "",
        status: "Active",
      });

      setPreview(null);
      setImage(null);

      router.push("/admin/staff");
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
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

      <form
        className={styles.grid}
        onSubmit={handleSubmit}>
        {/* Left Side */}

        <div className={styles.card}>
          <h3>Staff Information</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={staff.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={staff.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="+91 1234567890"
                value={staff.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="********"
                value={staff.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Role</label>

              <select
                name="role"
                value={staff.role}
                onChange={handleChange}
              >
                <option value="Administrator">
                  Administrator
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Sales">
                  Sales
                </option>

                <option value="Support">
                  Support
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Department</label>

              <input
                type="text"
                name="department"
                placeholder="Sales Department"
                value={staff.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              placeholder="Enter address..."
              value={staff.address}
              onChange={handleChange}
            />
          </div>
        </div>

        

        {/* Right side  all codes  */}

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

            <select
              name="status"
              value={staff.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push("/admin/staff")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Staff"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}