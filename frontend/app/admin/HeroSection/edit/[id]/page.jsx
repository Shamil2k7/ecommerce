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

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/hero-sections/${params.id}`
      );

      const data = res.data.hero;

      setHero({
        brand: data.brand || "",
        offer: data.offer || "",
        subOffer: data.subOffer || "",
        image: data.image || "",
        displayOrder: data.displayOrder || 1,
        status: data.status || "Active",
      });

      setPreview(data.image);
    } catch (error) {
      alert("Failed to fetch Hero Section");
      router.push("/admin/HeroSection");
    } finally {
      setFetching(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Only image files are allowed",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    const img = new Image();

    img.onload = () => {
      if (img.width < 1200 || img.height < 400) {
        setErrors((prev) => ({
          ...prev,
          image: "Image should be minimum 1200 x 400 pixels",
        }));
        return;
      }

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

    img.src = URL.createObjectURL(file);
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

    if (!hero.brand.trim())
      newErrors.brand = "Brand is required";

    if (!hero.image)
      newErrors.image = "Hero image is required";

    if (hero.displayOrder < 1)
      newErrors.displayOrder =
        "Display Order must be greater than 0";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/hero-sections/${params.id}`,
        hero
      );

      alert(res.data.message);

      router.push("/admin/HeroSection");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update Hero Section"
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

        <h1 className={styles.title}>
          Edit Hero Section
        </h1>

        <p className={styles.subtitle}>
          Update Hero Banner
        </p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formGroup}>
          <label>Brand</label>

          <input
            className={styles.input}
            type="text"
            name="brand"
            value={hero.brand}
            onChange={handleChange}
          />

          {errors.brand && (
            <p className={styles.error}>
              {errors.brand}
            </p>
          )}
        </div>

        {/* Offer */}
        {/* Uncomment if needed
        <div className={styles.formGroup}>
          <label>Offer</label>
          <input
            className={styles.input}
            type="text"
            name="offer"
            value={hero.offer}
            onChange={handleChange}
          />
        </div>
        */}

        {/* Sub Offer */}
        {/* Uncomment if needed
        <div className={styles.formGroup}>
          <label>Sub Offer</label>
          <input
            className={styles.input}
            type="text"
            name="subOffer"
            value={hero.subOffer}
            onChange={handleChange}
          />
        </div>
        */}

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
              hidden
              type="file"
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

        <div className={styles.formGroup}>
          <label>Display Order</label>

          <input
            className={styles.input}
            type="number"
            name="displayOrder"
            min="1"
            value={hero.displayOrder}
            onChange={handleChange}
          />

          {errors.displayOrder && (
            <p className={styles.error}>
              {errors.displayOrder}
            </p>
          )}
        </div>

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
            {loading
              ? "Updating..."
              : "Update Hero Section"}
          </button>
        </div>
      </div>
    </section>
  );
}