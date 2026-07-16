"use client";

import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AddBrand.module.css";

export default function AddBrandPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");

  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (value) => {
    setName(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setSlug(generatedSlug);
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Brand name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append(
        "isActive",
        isActive === "Active" ? "true" : "false"
      );

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch("http://localhost:5000/api/brands", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        alert("Brand created successfully!");
        router.push("/admin/brands");
      } else {
        alert(json.message || "Failed to create brand");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/brands" className={styles.back}>
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1>Add Brand</h1>
          <p>Create a new product brand</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {/* Left */}

          <div className={styles.left}>
            <div className={styles.card}>
              <h3>Brand Details</h3>

              <div className={styles.field}>
                <label>Brand Name *</label>

                <input
                  type="text"
                  placeholder="Enter brand name"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Slug</label>

                <input
                  type="text"
                  placeholder="brand-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Description</label>

                <textarea
                  rows={6}
                  placeholder="Brand description..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Right */}

          <div className={styles.right}>
            <div className={styles.card}>
              <h3>Brand Logo</h3>

              <label className={styles.uploadBox}>
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <>
                    <Upload size={35} />
                    <span>Upload Logo</span>
                  </>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogo}
                />
              </label>
            </div>

            <div className={styles.card}>
              <h3>Status</h3>

              <select
                value={isActive}
                onChange={(e) =>
                  setIsActive(e.target.value)
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.push("/admin/brands")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Brand"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}