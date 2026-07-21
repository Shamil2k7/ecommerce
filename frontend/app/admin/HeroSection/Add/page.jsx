"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./addHero.module.css";

export default function AddHeroSection() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [hero, setHero] = useState({
    brand: "",
    offer: "",
    subOffer: "",
    image: "",
    displayOrder: 1,
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  // Upload Image
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();

    reader.readAsDataURL(file);

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
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setHero((prev) => ({
      ...prev,
      [name]:
        name === "displayOrder"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!hero.brand.trim())
      newErrors.brand = "Brand is required";

    if (!hero.offer.trim())
      newErrors.offer = "Offer is required";

    if (!hero.subOffer.trim())
      newErrors.subOffer = "Sub Offer is required";

    if (!hero.image)
      newErrors.image = "Image is required";

    if (hero.displayOrder < 1)
      newErrors.displayOrder =
        "Display Order must be greater than 0";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Save Hero Section
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/hero-sections`,
        hero
      );

      alert(res.data.message);

      router.push("/admin/hero-sections");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create Hero Section"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      {/* Header */}

      <div className={styles.header}>
        <Link
          href="/admin/hero-sections"
          className={styles.backBtn}
        >
          <ArrowLeft size={18} />
          Back to Hero Sections
        </Link>

        <h1 className={styles.title}>
          Add Hero Section
        </h1>

        <p className={styles.subtitle}>
          Create a new Hero Banner.
        </p>
      </div>

      {/* Form */}

      <div className={styles.formCard}>
        {/* Brand */}

        <div className={styles.formGroup}>
          <label>Brand</label>

          <input
            className={`${styles.input} ${
              errors.brand ? styles.inputError : ""
            }`}
            type="text"
            name="brand"
            value={hero.brand}
            onChange={handleChange}
            placeholder="Enter Brand"
          />

          {errors.brand && (
            <p className={styles.error}>
              {errors.brand}
            </p>
          )}
        </div>

        {/* Offer */}

        <div className={styles.formGroup}>
          <label>Offer</label>

          <input
            className={`${styles.input} ${
              errors.offer ? styles.inputError : ""
            }`}
            type="text"
            name="offer"
            value={hero.offer}
            onChange={handleChange}
            placeholder="Enter Offer"
          />

          {errors.offer && (
            <p className={styles.error}>
              {errors.offer}
            </p>
          )}
        </div>

        {/* Sub Offer */}

        <div className={styles.formGroup}>
          <label>Sub Offer</label>

          <input
            className={`${styles.input} ${
              errors.subOffer
                ? styles.inputError
                : ""
            }`}
            type="text"
            name="subOffer"
            value={hero.subOffer}
            onChange={handleChange}
            placeholder="Enter Sub Offer"
          />

          {errors.subOffer && (
            <p className={styles.error}>
              {errors.subOffer}
            </p>
          )}
        </div>

        {/* Upload Image */}

        <div className={styles.formGroup}>
          <label>Hero Image</label>

          <label className={styles.uploadBox}>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
              />
            ) : (
              <>
                <Upload size={40} />
                <span>Upload Hero Image</span>
              </>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {errors.image && (
            <p className={styles.error}>
              {errors.image}
            </p>
          )}
        </div>

        {/* Display Order */}

        <div className={styles.formGroup}>
          <label>Display Order</label>

          <input
            className={`${styles.input} ${
              errors.displayOrder
                ? styles.inputError
                : ""
            }`}
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
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Buttons */}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() =>
              router.push("/admin/hero-sections")
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.saveBtn}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading
              ? "Saving..."
              : "Save Hero Section"}
          </button>
        </div>
      </div>
    </section>
  );
}