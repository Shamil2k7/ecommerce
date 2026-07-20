"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AddCategory.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= Fetch Parent Categories =================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);

        const data = await res.json();

        if (res.ok) {
          setCategories(data.data || data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ================= Generate Slug =================

  const handleNameChange = (value) => {
    setName(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setSlug(generatedSlug);
  };

  // ================= Image Preview =================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= Submit =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("isActive", isActive);

      if (parentCategory) {
        formData.append("parentCategory", parentCategory);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to create category");
      }

      alert("Category created successfully!");

      router.push("/admin/categories");
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link
            href="/admin/categories"
            className={styles.back}
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1>Add Category</h1>

          <p>Create a new category</p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.grid}>

          {/* LEFT */}

          <div>

            <div className={styles.card}>

              <h3>Category Details</h3>

              <div className={styles.field}>
                <label>Category Name *</label>

                <input
                  type="text"
                  value={name}
                  placeholder="Category name"
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label>Slug</label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value)
                  }
                />
              </div>

              <div className={styles.field}>
                <label>Parent Category</label>

                <select
                  value={parentCategory}
                  onChange={(e) =>
                    setParentCategory(e.target.value)
                  }
                >
                  <option value="">
                    None (Top Level)
                  </option>

                  {!loadingCategories &&
                    categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Description</label>

                <textarea
                  rows={5}
                  value={description}
                  placeholder="Description..."
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className={styles.card}>

              <h3>Category Image</h3>

              <label className={styles.uploadBox}>

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                  />
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

              <select
                value={isActive}
                onChange={(e) =>
                  setIsActive(
                    e.target.value === "true"
                  )
                }
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

            </div>

            <div className={styles.buttons}>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() =>
                  router.push("/admin/categories")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : "Save Category"}
              </button>

            </div>

          </div>

        </div>
      </form>
    </section>
  );
}