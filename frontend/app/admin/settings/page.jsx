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
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
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
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          youtube: data.youtube || "",
        });

        setLogoPreview(data.logo || "");
        setFaviconPreview(data.favicon || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      setLogo(null);
      setFavicon(null);

      fetchSettings();
    } catch (err) {
      console.log(err);
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
            Manage your storefront branding and footer details.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Store Settings</h2>
            <p>Branding, contact information and social media.</p>
          </div>

          <button
            className={styles.saveBtn}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.form}>
            {/* Logo */}
            <div className={styles.formGroup}>
              <label>Logo</label>

              {logoPreview && (
                <img src={logoPreview} alt="logo" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleLogo}
              />
            </div>

            {/* Favicon */}
            <div className={styles.formGroup}>
              <label>Favicon</label>

              {faviconPreview && (
                <img src={faviconPreview} alt="favicon" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFavicon}
              />
            </div>

            {/* Store Name */}
            <div className={styles.formGroup}>
              <label>Store Name</label>

              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="ShopAura"
              />
            </div>

            {/* Tagline */}
            <div className={styles.formGroup}>
              <label>Tagline</label>

              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Premium Shopping Experience"
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="support@shopaura.com"
              />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Address */}
            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label>Address</label>

              <textarea
                className={styles.textarea}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete office address"
              />
            </div>

            {/* Facebook */}
            <div className={styles.formGroup}>
              <label>Facebook URL</label>

              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            {/* Instagram */}
            <div className={styles.formGroup}>
              <label>Instagram URL</label>

              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            {/* Twitter */}
            <div className={styles.formGroup}>
              <label>Twitter/X URL</label>

              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://x.com/..."
              />
            </div>

            {/* YouTube */}
            <div className={styles.formGroup}>
              <label>YouTube URL</label>

              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}