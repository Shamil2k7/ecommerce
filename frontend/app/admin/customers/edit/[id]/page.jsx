"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import styles from "../../Customers.module.css"

export default function EditCustomerPage() {
  const [customer, setCustomer] = useState({
    image: "https://i.pravatar.cc/200?img=5",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    zip: "682001",
    role: "Customer",
    status: "Active",
  });

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCustomer({
        ...customer,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/customers" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Customers
          </Link>

          <h1>Edit Customer</h1>
          <p>Update customer details</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left */}
        <div className={styles.card}>
          <h3>Customer Information</h3>

          <div className={styles.field}>
            <label>Full Name</label>
            <input
              name="name"
              value={customer.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              name="email"
              value={customer.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Phone</label>
            <input
              name="phone"
              value={customer.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Address</label>
            <textarea
              rows="4"
              name="address"
              value={customer.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>City</label>
              <input
                name="city"
                value={customer.city}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>State</label>
              <input
                name="state"
                value={customer.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Country</label>
              <input
                name="country"
                value={customer.country}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>ZIP Code</label>
              <input
                name="zip"
                value={customer.zip}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className={styles.card}>
            <h3>Profile Image</h3>

            <label className={styles.upload}>
              <img src={customer.image} alt="" />

              <div className={styles.overlay}>
                <Upload size={22} />
                Change Image
              </div>

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>

          <div className={styles.card}>
            <h3>Account Settings</h3>

            <div className={styles.field}>
              <label>Role</label>

              <select
                name="role"
                value={customer.role}
                onChange={handleChange}
              >
                <option>Customer</option>
                <option>Admin</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Status</label>

              <select
                name="status"
                value={customer.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Blocked</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.deleteBtn}>
              <Trash2 size={18} />
              Delete
            </button>

            <button className={styles.cancelBtn}>
              Cancel
            </button>

            <button className={styles.saveBtn}>
              Update Customer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}