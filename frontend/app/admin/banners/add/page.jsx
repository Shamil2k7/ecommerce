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

  // Image Upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBanner((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
  };

  // Input Change
  const handleChange = (e) => {
    setBanner((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "displayOrder"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  // Save Banner
  const handleSubmit = async () => {
    try {
      if (!banner.image) {
        alert("Please select a banner image");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/marketing/banners`,
        banner
      );

      alert(res.data.message || "Banner Added Successfully");

      router.push("/admin/banners");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create banner"
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
        <div className={styles.field}>
          <label>Banner Image</label>

          <label className={styles.upload}>
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
        </div>

        <div className={styles.field}>
          <label>Display Order</label>

          <input
            type="number"
            name="displayOrder"
            value={banner.displayOrder}
            onChange={handleChange}
          />
        </div>

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