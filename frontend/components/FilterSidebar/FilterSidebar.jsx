"use client";

import { useState, useEffect } from "react";
import styles from "./FilterSidebar.module.css";

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
}) {
  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

  useEffect(() => {
    // Load Categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        setCategoriesList(json.data || []);
      })
      .catch((err) =>
        console.error("Failed to load categories:", err)
      );

    // Load Brands
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((json) => {
        setBrandsList(json.data || []);
      })
      .catch((err) =>
        console.error("Failed to load brands:", err)
      );
  }, []);

  // Category Filter
  const handleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([
        ...selectedCategories,
        category,
      ]);
    }
  };

  // Brand Filter
  const handleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(
        selectedBrands.filter((item) => item !== brand)
      );
    } else {
      setSelectedBrands([
        ...selectedBrands,
        brand,
      ]);
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}

      <div className={styles.header}>
        <h3>Filters</h3>

        <button
          className={styles.clearBtn}
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      {/* Categories */}

      <div className={styles.filterSection}>
        <h4>Categories</h4>

        {categoriesList.length > 0 ? (
          categoriesList.map((category) => (
            <label
              key={category._id}
              className={styles.checkbox}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(
                  category.name
                )}
                onChange={() =>
                  handleCategory(category.name)
                }
              />

              <span>{category.name}</span>
            </label>
          ))
        ) : (
          <p>No Categories</p>
        )}
      </div>

      {/* Brands */}

      <div className={styles.filterSection}>
        <h4>Brands</h4>

        {brandsList.length > 0 ? (
          brandsList.map((brand) => (
            <label
              key={brand._id}
              className={styles.checkbox}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(
                  brand.name
                )}
                onChange={() =>
                  handleBrand(brand.name)
                }
              />

              <span>{brand.name}</span>
            </label>
          ))
        ) : (
          <p>No Brands</p>
        )}
      </div>

      {/* Price */}

      <div className={styles.filterSection}>
        <h4>Price Range</h4>

        <label className={styles.radio}>
          <input type="radio" name="price" />
          <span>Under ₹1,000</span>
        </label>

        <label className={styles.radio}>
          <input type="radio" name="price" />
          <span>₹1,000 - ₹5,000</span>
        </label>

        <label className={styles.radio}>
          <input type="radio" name="price" />
          <span>₹5,000 - ₹10,000</span>
        </label>

        <label className={styles.radio}>
          <input type="radio" name="price" />
          <span>Above ₹10,000</span>
        </label>
      </div>

      {/* Rating */}

      <div className={styles.filterSection}>
        <h4>Rating</h4>

        <label className={styles.radio}>
          <input type="radio" name="rating" />
          ⭐⭐⭐⭐⭐
        </label>

        <label className={styles.radio}>
          <input type="radio" name="rating" />
          ⭐⭐⭐⭐☆
        </label>

        <label className={styles.radio}>
          <input type="radio" name="rating" />
          ⭐⭐⭐☆☆
        </label>
      </div>

      {/* Availability */}

      <div className={styles.filterSection}>
        <h4>Availability</h4>

        <label className={styles.checkbox}>
          <input type="checkbox" />
          <span>In Stock</span>
        </label>

        <label className={styles.checkbox}>
          <input type="checkbox" />
          <span>Out of Stock</span>
        </label>
      </div>
    </aside>
  );
}