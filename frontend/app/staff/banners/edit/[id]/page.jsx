"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import styles from "../../add/AddBanner.module.css";

export default function EditBannerPage() {
  const [banner, setBanner] = useState({
    image: "/offerbanner1.jfif",
    order: 1,
    status: "Active",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBanner({
        ...banner,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <section className={styles.container}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <Link href="/admin/banners" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Banners
          </Link>

          <h1>Edit Banner</h1>
          <p>Update homepage banner</p>
        </div>
      </div>

      {/* Form */}

      <div className={styles.card}>
        <div className={styles.field}>
          <label>Banner Image</label>

          <label className={styles.upload}>
            <img
              src={banner.image}
              alt="Banner"
            />

            <div className={styles.overlay}>
              <Upload size={24} />
              <span>Change Image</span>
            </div>

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
            value={banner.order}
            onChange={(e) =>
              setBanner({
                ...banner,
                order: e.target.value,
              })
            }
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>

          <select
            value={banner.status}
            onChange={(e) =>
              setBanner({
                ...banner,
                status: e.target.value,
              })
            }
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button className={styles.delete}>
            <Trash2 size={18} />
            Delete
          </button>

          <button className={styles.cancel}>
            Cancel
          </button>

          <button className={styles.save}>
            Update Banner
          </button>
        </div>
      </div>
    </section>
  );
}