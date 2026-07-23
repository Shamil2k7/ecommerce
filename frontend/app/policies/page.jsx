"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Policies.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PoliciesPage() {
  const [loading, setLoading] = useState(true);

  const [policy, setPolicy] = useState({
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
        setPolicy(res.data.policy);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading Policies...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Policies</h1>
        <p>
          Please read our policies carefully before using our website.
        </p>
      </div>

      <div className={styles.card}>
        <h2>Privacy Policy</h2>

        <div className={styles.content} id="privacy">
          {policy.privacyPolicy || "No Privacy Policy Available."}
        </div>
      </div>

      <div className={styles.card}>
        <h2 id="terms">Terms & Conditions</h2>

        <div className={styles.content}>
          {policy.termsConditions || "No Terms & Conditions Available."}
        </div>
      </div>

      <div className={styles.card} >
        <h2 id="refund">Refund Policy</h2>

        <div className={styles.content}>
          {policy.refundPolicy || "No Refund Policy Available."}
        </div>
      </div>

      <div className={styles.card} >
        <h2 id="cookies">Cookie Policy</h2>

        <div className={styles.content}>
          {policy.cookiePolicy || "No Cookie Policy Available."}
        </div>
      </div>
    </div>
  );
}