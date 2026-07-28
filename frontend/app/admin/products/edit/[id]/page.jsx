"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import styles from "../../add/AddProduct.module.css";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  // Categories list
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentImageId, setCurrentImageId] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    // 1. Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // 1.5. Fetch brands
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setBrands(json.data);
        }
      })
      .catch((err) => console.error("Error fetching brands:", err));

    // 2. Fetch product by ID
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const p = json.data;
          setName(p.name || "");
          setSlug(p.slug || "");
          setCategory(typeof p.category === "object" ? p.category?._id : p.category || "");
          setBrand(typeof p.brand === "object" ? p.brand?._id : p.brand || "");
          setPrice(p.price || "");
          setSalePrice(p.discountPrice || "");
          setStock(p.stock || 0);
          setSku(p.sku || "");
          setDescription(p.description || "");
          setCurrentImage(
            p.images?.[0]?.url || "/images/headphone.png"
          );

          setCurrentImageId(
            p.images?.[0]?.public_id || ""
          );
        }
      })
      .catch((err) => console.error("Error loading product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImageId) {
      alert("No image found.");
      return;
    }

    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}/images/${currentImageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Image deleted successfully.");

        setCurrentImage("/images/headphone.png");
        setCurrentImageId("");
        setNewImageFile(null);
      } else {
        alert(data.message || "Failed to delete image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting image.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Product deleted successfully!");
        router.push("/admin/products");
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !brand || !price || !description) {
      alert("Name, Category, Brand, Price, and Description are required.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update text fields using JSON PATCH API
      const updates = {
        name,
        slug,
        category,
        brand,
        price: Number(price),
        discountPrice: salePrice ? Number(salePrice) : 0,
        stock: Number(stock),
        sku,
        description,
      };

      const patchRes = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!patchRes.ok) {
        const errJson = await patchRes.json();
        throw new Error(errJson.message || "Failed to update product details.");
      }

      // 2. Upload new image if chosen
      if (newImageFile) {
        const imgData = new FormData();
        imgData.append("images", newImageFile);

        const imgRes = await fetch(`http://localhost:5000/api/products/${id}/images`, {
          method: "POST",
          credentials: "include",
          body: imgData,
        });


        if (!imgRes.ok) {
          alert("Product details updated, but new image upload failed.");
        }
      }

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert(`Error updating product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading Product Details...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/products" className={styles.back}>
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <h1>Edit Product</h1>
        <p>Update product information.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Product Name *</label>
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
            <label>Category *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Brand *</label>
            <select
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Select Brand</option>
              {brands.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Sale Price (₹)</label>
            <input
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Stock *</label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Description *</label>
          <textarea
            rows="6"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Current Image</label>

          <img
            src={currentImage}
            alt="Product"
            className={styles.preview}
            style={{
              maxWidth: "150px",
              borderRadius: "8px",
              marginTop: "10px",
              display: "block",
            }}
          />

          {currentImage !== "/images/headphone.png" && (
            <button
              type="button"
              onClick={handleDeleteImage}
              style={{
                marginTop: "12px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete Current Image
            </button>
          )}
        </div>

        <div className={styles.field}>
          <label>Change Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.delete}
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            Delete Product
          </button>

          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.primary}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}