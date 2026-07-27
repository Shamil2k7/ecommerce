"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./AddBanner.module.css";

export default function AddBanner() {
  const router = useRouter();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState({
    image: "",
    displayOrder: 1,
    status: "Active",
  });
  const [errors, setErrors] = useState({
    image: "",
    displayOrder: "",
  });

const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;


  if (!file.type.startsWith("image/")) {
    setErrors((prev) => ({
      ...prev,
      image: "Please select a valid image file.",
    }));
    return;
  }

  const img = new Image();

  img.onload = () => {
  
    if (img.width < 1600 || img.height < 600) {
      setErrors((prev) => ({
        ...prev,
        image: "Banner image must be at least 1600 × 600 pixels.",
      }));

      setPreview(null);

      setBanner((prev) => ({
        ...prev,
        image: "",
      }));

      return;
    }


    setErrors((prev) => ({
      ...prev,
      image: "",
    }));


    setPreview(URL.createObjectURL(file));

 
    const reader = new FileReader();

    reader.onloadend = () => {
      setBanner((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  img.onerror = () => {
    setErrors((prev) => ({
      ...prev,
      image: "Unable to read image.",
    }));
  };

  img.src = URL.createObjectURL(file);
};


  const handleChange = (e) => {
    const { name, value } = e.target;

    setBanner((prev) => ({
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
  const validateForm = () => {
    const newErrors = {};

    if (!banner.image) {
      newErrors.image = "Banner image is required";
    }

    if (!banner.displayOrder && banner.displayOrder !== 0) {
      newErrors.displayOrder = "Display Order is required";
    } else if (Number(banner.displayOrder) < 1) {
      newErrors.displayOrder =
        "Display Order must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/banners`,
        banner, {
        withCredentials: true,
      }
      );

      alert(res.data.message || "Banner Added Successfully");

      router.push("/admin/banners");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create banner"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/banners" className={styles.back}>
          <ArrowLeft size={18} />
          Back to Banners
        </Link>

        <h1>Add Banner</h1>
        <p>Upload a homepage slider image.</p>
      </div>

      <div className={styles.card}>
        {/* Banner Image */}
        <div className={styles.field}>
          <label>Banner Image</label>

          <label
            className={`${styles.upload} ${errors.image ? styles.errorUpload : ""
              }`}
          >
            {preview ? (
              <img src={preview} alt="Banner Preview" />
            ) : (
              <>
                <Upload size={40} />
                <span>Upload Banner</span>
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
        <div className={styles.field}>
          <label>Display Order</label>

          <input
            type="number"
            name="displayOrder"
            min="1"
            value={banner.displayOrder}
            onChange={handleChange}
            placeholder="Enter display order"
            className={
              errors.displayOrder ? styles.errorInput : ""
            }
          />

          {errors.displayOrder && (
            <p className={styles.error}>
              {errors.displayOrder}
            </p>
          )}
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label>Status</label>

          <select
            name="status"
            value={banner.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => router.push("/admin/banners")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.save}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </div>
    </section>
  );
}