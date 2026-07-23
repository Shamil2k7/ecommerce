"use client";  

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./EditBrand.module.css";

export default function EditBrandPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("Active");

  const [currentLogo, setCurrentLogo] = useState("");
  const [newLogo, setNewLogo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/brands/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const brand = json.data;

          setName(brand.name || "");
          setSlug(brand.slug || "");
          setDescription(brand.description || "");
          setIsActive(brand.isActive ? "Active" : "Inactive");

          setCurrentLogo(
            brand.logo?.url
              ? (brand.logo.url.startsWith("http") ? brand.logo.url : `http://localhost:5000${brand.logo.url}`)
              : "https://via.placeholder.com/300x200?text=Brand"
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewLogo(file);
      setCurrentLogo(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this brand?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/brands/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Brand deleted successfully.");
        router.push("/admin/brands");
      } else {
        const json = await res.json();
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append(
        "isActive",
        isActive === "Active"
      );

      if (newLogo) {
        formData.append("logo", newLogo);
      }

      const res = await fetch(
        `http://localhost:5000/api/brands/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const json = await res.json();

      if (res.ok) {
        alert("Brand updated successfully.");
        router.push("/admin/brands");
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        Loading Brand...
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link
            href="/admin/brands"
            className={styles.back}
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1>Edit Brand</h1>
          <p>Update brand details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Brand Details</h3>

            <div className={styles.field}>
              <label>Name</label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Slug</label>

              <input
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Description</label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <div className={styles.card}>
              <h3>Brand Logo</h3>

              <label className={styles.upload}>
                <img
                  src={currentLogo}
                  alt="Brand"
                />

                <div className={styles.overlay}>
                  <Upload size={22} />
                  Change Logo
                </div>

                <input
                  hidden
                  type="file"
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
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
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
                onClick={() =>
                  router.push("/admin/brands")
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
                  ? "Updating..."
                  : "Update Brand"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
