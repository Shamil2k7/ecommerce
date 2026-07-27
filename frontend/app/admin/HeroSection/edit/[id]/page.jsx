"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./editHero.module.css";

export default function EditHeroSection() {
  const router = useRouter();
  const params = useParams();
  const API = process.env.NEXT_PUBLIC_API_URL;

  // State
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [hero, setHero] = useState({
    brand: "",
    image: "",
    displayOrder: 1,
    status: "Active",
  });

  // Fetch hero on page load
  useEffect(() => {
    if (params.id) {
      fetchHero();
    }
  }, [params.id]);

  // Fetch Hero
  const fetchHero = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/hero-sections/${params.id}`,
        {
          withCredentials: true,
        }
      );

      const data = res.data.hero;

      setHero({
        brand: data.brand || "",
        image: data.image || "",
        displayOrder: data.displayOrder || 1,
        status: data.status || "Active",
      });

      setPreview(data.image);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/admin/login");
        return;
      }

      alert("Failed to fetch Hero Section.");
      router.push("/admin/HeroSection");
    } finally {
      setFetching(false);
    }
  };

  // Handle Image Upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ image: "Only image files are allowed." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image size must be less than 5MB." });
      return;
    }

    const imageURL = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (img.width < 1600 || img.height < 500) {
        setErrors({
          image: "Image should be at least 1600 × 500 pixels.",
        });
        return;
      }

      setPreview(imageURL);

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

    img.src = imageURL;
  };

  // Handle Input Change
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

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!hero.brand.trim()) {
      newErrors.brand = "Brand is required.";
    }

    if (!hero.image) {
      newErrors.image = "Hero image is required.";
    }

    if (hero.displayOrder < 1) {
      newErrors.displayOrder =
        "Display Order must be greater than 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Update
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/marketing/hero-sections/${params.id}`,
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

      alert(res.data.message || "Hero updated successfully.");
      router.push("/admin/HeroSection");
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
        router.push("/admin/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update Hero Section."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

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

        <h1 className={styles.title}>Edit Hero Section</h1>

        <p className={styles.subtitle}>
          Update Hero Banner
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
            placeholder="Enter Brand Name"
          />

          {errors.brand && (
            <p className={styles.error}>{errors.brand}</p>
          )}
        </div>

        {/* Image */}
        <div className={styles.formGroup}>
          <label>Hero Image</label>

          <label className={styles.uploadBox}>
            {preview ? (
              <img src={preview} alt="Hero Preview" />
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
            onClick={() => router.push("/admin/HeroSection")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Hero Section"}
          </button>
        </div>
      </div>
    </section>
  );
}