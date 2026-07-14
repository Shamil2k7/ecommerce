"use client";

import styles from "./AddProduct.module.css";

export default function AddProductPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add Product</h1>
        <p>Create a new product for your store.</p>
      </div>

      <form className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Product Name</label>
            <input type="text" placeholder="Enter product name" />
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <input type="text" placeholder="product-slug" />
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <select>
              <option>Select Category</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Shoes</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Brand</label>
            <input type="text" placeholder="Brand" />
          </div>

          <div className={styles.field}>
            <label>Price</label>
            <input type="number" placeholder="₹0.00" />
          </div>

          <div className={styles.field}>
            <label>Sale Price</label>
            <input type="number" placeholder="₹0.00" />
          </div>

          <div className={styles.field}>
            <label>Stock</label>
            <input type="number" placeholder="0" />
          </div>

          <div className={styles.field}>
            <label>SKU</label>
            <input type="text" placeholder="SKU12345" />
          </div>
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea rows="6" placeholder="Write product description..." />
        </div>

        <div className={styles.field}>
          <label>Product Images</label>
          <input type="file" multiple />
        </div>

        <div className={styles.actions}>
          <button type="reset" className={styles.secondary}>
            Reset
          </button>

          <button type="submit" className={styles.primary}>
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}