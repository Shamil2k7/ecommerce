"use client";

import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import styles from "./AddCategory.module.css";

export default function AddCategoryPage() {
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
        <div>
          <Link href="/admin/categories" className={styles.back}>
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1>Add Category</h1>
          <p>Create a new product category</p>
        </div>
      </div>

      <form className={styles.form}>
        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.left}>
            <div className={styles.card}>
              <h3>Category Details</h3>

              <div className={styles.field}>
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                />
              </div>

              <div className={styles.field}>
                <label>Slug</label>
                <input
                  type="text"
                  placeholder="category-slug"
                />
              </div>

              <div className={styles.field}>
                <label>Parent Category</label>

                <select>
                  <option>None</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Description</label>

                <textarea
                  rows="5"
                  placeholder="Category description..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className={styles.right}>
            <div className={styles.card}>
              <h3>Category Image</h3>

              <label className={styles.uploadBox}>
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <>
                    <Upload size={35} />
                    <span>Upload Image</span>
                  </>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />
              </label>
            </div>

            <div className={styles.card}>
              <h3>Status</h3>

              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.cancelBtn}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveBtn}
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}