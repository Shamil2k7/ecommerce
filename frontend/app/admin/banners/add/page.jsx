"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./AddBanner.module.css";

export default function AddBanner() {
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
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
              <img src={preview} alt="" />
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
            placeholder="1"
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>

          <select>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button className={styles.cancel}>
            Cancel
          </button>

          <button className={styles.save}>
            Save Banner
          </button>
        </div>

      </div>
    </section>
  );
}