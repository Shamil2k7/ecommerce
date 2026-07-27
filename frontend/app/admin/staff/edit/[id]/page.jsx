"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import styles from "../../add/AddStaff.module.css";

export default function EditStaffPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [image, setImage] = useState(null);

  const [staff, setStaff] = useState({
    profileImage: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
    department: "",
    address: "",
    status: "Active",
  });



  useEffect(() => {
    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      setPageLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`,{
          credentials:"include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStaff({
        profileImage: data.data.profileImage,
        fullName: data.data.fullName,
        email: data.data.email || "",
        phone: data.data.phone || "",
        password: "",
        role: data.data.role || "staff",
        department: data.data.department || "",
        address: data.data.address || "",
        status: data.data.status || "Active",
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setPageLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // handles images uploaded

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setStaff((prev) => ({
      ...prev,
      profileImage: URL.createObjectURL(file)
    }));
  };


  // updated staffes form submits

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", staff.fullName);
      formData.append("email", staff.email);
      formData.append("phone", staff.phone);
      formData.append("role", staff.role);
      formData.append("department", staff.department);
      formData.append("address", staff.address);
      formData.append("status", staff.status);

      if (staff.password.trim() !== "") {
        formData.append("password", staff.password);
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`,
        {
          method: "PUT",
          body: formData,
          credentials:"include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Staff updated successfully");

      router.push("/admin/staff");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

 
  // delete staffs handel 
 
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`,
        {
          method: "DELETE",
          credentials:"include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Staff deleted successfully");

      router.push("/admin/staff");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <section className={styles.container}>
        <h2>Loading...</h2>
      </section>
    );
  }
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

      <form className={styles.grid} onSubmit={handleSubmit}>
        {/* left side  all codes  */}

        <div className={styles.card}>
          <h3>Staff Information</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={staff.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Phone</label>

              <input
                type="text"
                name="phone"
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
                placeholder="Leave blank to keep current password"
                value={staff.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Department</label>

            <input
              type="text"
              name="department"
              value={staff.department}
              onChange={handleChange}
              placeholder="Enter Department"
            />
          </div>

          <div className={styles.field}>
            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              value={staff.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* right side  all codes  */}

        <div>
          <div className={styles.card}>
            <h3>Profile Photo</h3>

            <label className={styles.upload}>
              {staff.profileImage ? (
                <img
                  src={staff.profileImage}
                  alt={staff.fullName}
                />
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

              {staff.profileImage && (
                <div className={styles.overlay}>
                  <Upload size={24} />
                  <span>Change Photo</span>
                </div>
              )}
            </label>
          </div>

          <div className={styles.card}>
            <h3>Status</h3>

            <select
              name="status"
              value={staff.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2
                size={20}
                className={styles.trashIcon}
              />

              <span className={styles.deleteText}>
                Delete
              </span>
            </button>

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
              {loading ? "Updating..." : "Update Staff"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}