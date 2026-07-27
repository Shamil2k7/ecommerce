"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Policies.module.css";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PoliciesPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    privacyPolicy: "",
    termsConditions: "",
    refundPolicy: "",
    cookiePolicy: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${API}/api/policies`);

      if (res.data.success) {
        setFormData({
          privacyPolicy: res.data.policy.privacyPolicy || "",
          termsConditions: res.data.policy.termsConditions || "",
          refundPolicy: res.data.policy.refundPolicy || "",
          cookiePolicy: res.data.policy.cookiePolicy || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/policies`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Policies Updated Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update policies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Policies</h1>
          <p>
            Manage your website policies from one place.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={styles.saveBtn}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Privacy Policy */}

      <div className={styles.card}>
        <h2>Privacy Policy</h2>

        <textarea
          name="privacyPolicy"
          value={formData.privacyPolicy}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Write Privacy Policy..."
        />
      </div>

      {/* Terms */}

      <div className={styles.card}>
        <h2>Terms & Conditions</h2>

        <textarea
          name="termsConditions"
          value={formData.termsConditions}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Write Terms & Conditions..."
        />
      </div>

      {/* Refund */}

      <div className={styles.card}>
        <h2>Refund Policy</h2>

        <textarea
          name="refundPolicy"
          value={formData.refundPolicy}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Write Refund Policy..."
        />
      </div>

      {/* Cookie */}

      <div className={styles.card}>
        <h2>Cookie Policy</h2>

        <textarea
          name="cookiePolicy"
          value={formData.cookiePolicy}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Write Cookie Policy..."
        />
      </div>
    </div>
  );
}