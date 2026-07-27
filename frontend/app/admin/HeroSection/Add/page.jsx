"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./addHero.module.css";

export default function AddHeroSection() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [hero, setHero] = useState({
    brand: "",
    image: "",
    displayOrder: 1,
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ image: "Only image files are allowed" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image size must be less than 5MB" });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width < 1600 || img.height < 500) {
        setErrors({
          image: "Banner image should be at least 1600 × 500 pixels",
        });

        URL.revokeObjectURL(url);
        return;
      }

      setPreview(url);

      const reader = new FileReader();

      reader.onloadend = () => {
        setHero((prev) => ({
          ...prev,
          image: reader.result,
        }));

        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      };

      reader.readAsDataURL(file);
    };

    img.src = url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHero((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!hero.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!hero.image) {
      newErrors.image = "Hero image is required";
    }

    if (hero.displayOrder < 1) {
      newErrors.displayOrder = "Display order must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (!API) {
        alert("NEXT_PUBLIC_API_URL is missing");
        return;
      }

      const response = await axios.post(
        `${API}/api/marketing/hero-sections`,
        {
          brand: hero.brand.trim(),
          image: hero.image,
          displayOrder: hero.displayOrder,
          status: hero.status,
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message || "Hero section created successfully");
      router.push("/admin/HeroSection");
    } catch (error) {
      console.error("Hero Create Error:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/admin/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to create hero section"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Link
          href="/admin/HeroSection"
          className={styles.backBtn}
        >
          <ArrowLeft size={18} />
          Back to Hero Sections
        </Link>

        <h1 className={styles.title}>Add Hero Section</h1>

        <p className={styles.subtitle}>
          Create a new Hero Banner
        </p>
      </div>

      <div className={styles.formCard}>
        {/* Brand */}
        <div className={styles.formGroup}>
          <label>Brand</label>

          <input
            className={styles.input}
            type="text"
            name="brand"
            value={hero.brand}
            onChange={handleChange}
            placeholder="Enter Brand"
          />

          {errors.brand && (
            <p className={styles.error}>{errors.brand}</p>
          )}
        </div>

        {/* Hero Image */}
        <div className={styles.formGroup}>
          <label>Hero Image</label>

          <label className={styles.uploadBox}>
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <>
                <Upload size={40} />
                <span>Upload Hero Image</span>
              </>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {errors.image && (
            <p className={styles.error}>{errors.image}</p>
          )}
        </div>

        {/* Display Order */}
        <div className={styles.formGroup}>
          <label>Display Order</label>

          <input
            className={styles.input}
            type="number"
            min="1"
            name="displayOrder"
            value={hero.displayOrder}
            onChange={handleChange}
          />

          {errors.displayOrder && (
            <p className={styles.error}>
              {errors.displayOrder}
            </p>
          )}
        </div>

        {/* Status */}
        <div className={styles.formGroup}>
          <label>Status</label>

          <select
            className={styles.select}
            name="status"
            value={hero.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelBtn}
            onClick={() =>
              router.push("/admin/HeroSection")
            }
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Hero Section"}
          </button>
        </div>
      </div>
    </section>
  );
}