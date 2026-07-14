"use client";

import { useState } from "react";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import styles from "../../Categories.module.css";

export default function EditCategoryPage() {
  const [category, setCategory] = useState({
    name: "Electronics",
    slug: "electronics",
    parent: "None",
    description: "Electronic gadgets and accessories.",
    status: "Active",
    image: "/categories/electronics.jpg",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCategory({
        ...category,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/categories" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Categories
          </Link>

          <h1>Edit Category</h1>
          <p>Update category information</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left */}
        <div className={styles.card}>
          <h3>Category Details</h3>

          <div className={styles.field}>
            <label>Name</label>
            <input
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <input
              value={category.slug}
              onChange={(e) =>
                setCategory({ ...category, slug: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Parent Category</label>

            <select
              value={category.parent}
              onChange={(e) =>
                setCategory({ ...category, parent: e.target.value })
              }
            >
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
              value={category.description}
              onChange={(e) =>
                setCategory({
                  ...category,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Right */}
        <div>
          <div className={styles.card}>
            <h3>Category Image</h3>

            <label className={styles.upload}>
              <img src={category.image} alt="Category" />

              <div className={styles.overlay}>
                <Upload size={22} />
                Change Image
              </div>

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

            <select
              value={category.status}
              onChange={(e) =>
                setCategory({
                  ...category,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button className={styles.deleteBtn}>
              <Trash2 size={18} />
              Delete
            </button>

            <button className={styles.cancelBtn}>
              Cancel
            </button>

            <button className={styles.saveBtn}>
              Update Category
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}