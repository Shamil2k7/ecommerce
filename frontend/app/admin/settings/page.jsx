"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Settings.module.css";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    tagline: "",
  });

  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/api/settings`);

      if (res.data.success) {
        const data = res.data.settings;

        setFormData({
          storeName: data.storeName || "",
          tagline: data.tagline || "",
        });

        setLogoPreview(data.logo || "");
        setFaviconPreview(data.favicon || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFavicon = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFavicon(file);
    setFaviconPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.put(`${API}/api/settings`, formData);

      if (logo) {
        const fd = new FormData();
        fd.append("logo", logo);

        await axios.put(`${API}/api/settings/logo`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (favicon) {
        const fd = new FormData();
        fd.append("favicon", favicon);

        await axios.put(`${API}/api/settings/favicon`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Settings Updated Successfully");

      fetchSettings();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.settingsTitle}>Site Settings</h1>

          <p className={styles.settingsDescription}>
            Manage your storefront branding
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Branding</h2>
            <p>Logo, favicon and store details</p>
          </div>

          <button
            onClick={handleSubmit}
            className={styles.saveBtn}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.form}>

            <div className={styles.formGroup}>
              <label>Logo</label>

              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="logo"
                  width={120}
                  height={120}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleLogo}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Favicon</label>

              {faviconPreview && (
                <img
                  src={faviconPreview}
                  alt="favicon"
                  width={70}
                  height={70}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFavicon}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Store Name</label>

              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Enter Store Name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tagline</label>

              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Enter Store Tagline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}