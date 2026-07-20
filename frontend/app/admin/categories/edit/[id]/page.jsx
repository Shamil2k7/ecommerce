"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./EditCategory.module.css";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isChild, setIsChild] = useState(false);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");
  const [currentImage, setCurrentImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  // Categories list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch all categories to populate parent selection dropdown
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // 2. Fetch current category details
    fetch(`http://localhost:5000/api/categories/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const cat = json.data;
          setName(cat.name || "");
          setSlug(cat.slug || "");
          const pCatId = typeof cat.parentCategory === "object" && cat.parentCategory
            ? cat.parentCategory._id
            : cat.parentCategory || "";
          setParentCategory(pCatId);
          setIsChild(!!pCatId);
          setDescription(cat.description || "");
          setIsActive(cat.isActive !== false ? "Active" : "Inactive");
          setCurrentImage(cat.image?.url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500");
        }
      })
      .catch((err) => console.error("Error loading category:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok) {
        alert("Category deleted successfully!");
        router.push("/admin/categories");
      } else {
        alert(`Failed to delete category: ${json.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Category Name is required.");
      return;
    }

    if (isChild && !parentCategory) {
      alert("Please select a parent category for the subcategory.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("parentCategory", parentCategory || "");
      formData.append("isActive", isActive === "Active" ? "true" : "false");

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        alert("Category updated successfully!");
        router.push("/admin/categories");
      } else {
        alert(`Failed to update category: ${json.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating category.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading Category Details...</h2>
      </div>
    );
  }

  // Filter out the current category so it can't be set as its own parent
  const parentCandidates = categories.filter((cat) => cat._id !== id);

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

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.card}>
            <h3>Category Details</h3>

            <div className={styles.field}>
              <label>Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Category Type</label>
              <div className={styles.radioGroup} style={{ display: "flex", gap: "20px", marginTop: "8px", marginBottom: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="categoryType"
                    value="parent"
                    checked={!isChild}
                    onChange={() => {
                      setIsChild(false);
                      setParentCategory("");
                    }}
                  />
                  <span>Parent Category (Top-Level)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="categoryType"
                    value="child"
                    checked={isChild}
                    onChange={() => setIsChild(true)}
                  />
                  <span>Child Category (Subcategory)</span>
                </label>
              </div>
            </div>

            {isChild && (
              <div className={styles.field}>
                <label>Select Parent Category</label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">-- Choose Parent Category --</option>
                  {parentCandidates
                    .filter((cat) => !cat.parentCategory) // only show categories that are parent categories
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className={styles.field}>
              <label>Description</label>
              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Right */}
          <div>
            <div className={styles.card}>
              <h3>Category Image</h3>

              <label className={styles.upload}>
                <img src={currentImage} alt="Category" />

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
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                <Trash2 size={18} />
                Delete
              </button>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.push("/admin/categories")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}