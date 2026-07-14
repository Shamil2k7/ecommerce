"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import styles from "../../add/AddProduct.module.css";

export default function EditProductPage() {
  const [product, setProduct] = useState({
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    category: "Electronics",
    brand: "Apple",
    price: 129999,
    salePrice: 124999,
    stock: 25,
    sku: "APL-IP16PRO",
    description:
      "Latest Apple iPhone with A18 Pro chip and advanced camera system.",
    image: "/products/iphone.jpg",
  });

  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProduct({
        ...product,
        image: URL.createObjectURL(file),
      });
    }
  };

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

      <form className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Product Name</label>

            <input
              value={product.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Slug</label>

            <input
              value={product.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Category</label>

            <select
              value={product.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Shoes</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Brand</label>

            <input
              value={product.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Price</label>

            <input
              type="number"
              value={product.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Sale Price</label>

            <input
              type="number"
              value={product.salePrice}
              onChange={(e) => handleChange("salePrice", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Stock</label>

            <input
              type="number"
              value={product.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>SKU</label>

            <input
              value={product.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Description</label>

          <textarea
            rows="6"
            value={product.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <label>Current Image</label>

          <img
            src={product.image}
            alt="Product"
            className={styles.preview}
          />
        </div>

        <div className={styles.field}>
          <label>Change Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.delete}
          >
            <Trash2 size={18} />
            Delete
          </button>

          <button
            type="reset"
            className={styles.secondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.primary}
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}