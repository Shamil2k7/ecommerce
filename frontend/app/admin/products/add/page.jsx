"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProduct.module.css";

export default function AddProductPage() {
  const router = useRouter();

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
  const [imageFiles, setImageFiles] = useState([]);

  // Categories list
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  
  const [brands, setBrands] = useState([]);
const [selectedBrandId, setSelectedBrandId] = useState("");

useEffect(() => {

  fetch("http://localhost:5000/api/categories")
    .then(res => res.json())
    .then(data => setCategories(data.data));

  fetch("http://localhost:5000/api/brands")
    .then(res => res.json())
    .then(data => setBrands(data.data));

}, []);

useEffect(() => {
  const loadData = async () => {
    try {
      const [categoryRes, brandRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/brands"),
      ]);

      const categoryData = await categoryRes.json();
      const brandData = await brandRes.json();

      setCategories(categoryData.data || []);
      setBrands(brandData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  loadData();
}, []);

  const handleNameChange = (val) => {
    setName(val);
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || !description) {
      alert("Name, Category, Price, and Description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("category", category);
      formData.append("price", Number(price));
    
      
      if (selectedBrandId) {
  formData.append("brand", selectedBrandId);
}

      if (salePrice) {
        formData.append("discountPrice", Number(salePrice));
      }
      formData.append("stock", Number(stock || 0));
      if (sku) {
        formData.append("sku", sku);
      }
      formData.append("description", description);

      // Append image files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        alert(`Failed to save product: ${json.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add Product</h1>
        <p>Create a new product for your store.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Product Name *</label>
            <input
              type="text"
              placeholder="Enter product name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <input
              type="text"
              placeholder="product-slug"
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
  <label>Brand</label>

  <select
    value={selectedBrandId}
    onChange={(e) => setSelectedBrandId(e.target.value)}
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
              placeholder="0.00"
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
              placeholder="0.00"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Stock *</label>
            <input
              type="number"
              placeholder="0"
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
              placeholder="SKU12345"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Description *</label>
          <textarea
            rows="6"
            placeholder="Write product description..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.actions}>
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
            {submitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}