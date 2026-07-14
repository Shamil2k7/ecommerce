"use client";

import styles from "./FilterSidebar.module.css";

const categories = [
  "Electronics",
  "Fashion",
  "Shoes",
  "Beauty",
  "Furniture",
  "Accessories",
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Puma",
];

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
}) {

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

  // Clear All Filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  return (
    <aside className={styles.sidebar}>

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

        {categories.map((category) => (
          <label
            key={category}
            className={styles.checkbox}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() =>
                handleCategory(category)
              }
            />

            <span>{category}</span>

          </label>
        ))}

      </div>

      {/* Brands */}

      <div className={styles.filterSection}>

        <h4>Brands</h4>

        {brands.map((brand) => (
          <label
            key={brand}
            className={styles.checkbox}
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() =>
                handleBrand(brand)
              }
            />

            <span>{brand}</span>

          </label>
        ))}

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

      {/* Stock */}

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