"use client";

import { useState, useEffect } from "react";
import styles from "./FilterSidebar.module.css";

export default function FilterSidebar({
  categoriesList = [],
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
}) {
  const [brandsList, setBrandsList] = useState([]);

  useEffect(() => {
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
  const handleCategory = (categoryName) => {
    const category = categoriesList.find((c) => c.name === categoryName);
    if (!category) return;

    const isParent = !category.parentCategory;

    // Find all children of this category (if it is a parent)
    const children = isParent
      ? categoriesList
          .filter((c) => {
            const pId = typeof c.parentCategory === "object" && c.parentCategory
              ? c.parentCategory._id
              : c.parentCategory;
            return pId === category._id;
          })
          .map((c) => c.name)
      : [];

    const related = [categoryName, ...children];
    const allRelatedSelected = related.every((name) =>
      selectedCategories.includes(name)
    );

    if (allRelatedSelected) {
      // Uncheck all of them
      setSelectedCategories((prev) =>
        prev.filter((name) => !related.includes(name))
      );
    } else {
      // Check all of them
      setSelectedCategories((prev) => {
        const next = new Set([...prev, ...related]);
        return Array.from(next);
      });
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

  const parentCategories = categoriesList.filter((c) => !c.parentCategory);

  const getChildrenOf = (parentId) => {
    return categoriesList.filter((c) => {
      const pId = typeof c.parentCategory === "object" && c.parentCategory
        ? c.parentCategory._id
        : c.parentCategory;
      return pId === parentId;
    });
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

        {parentCategories.length > 0 ? (
          <div className={styles.categoryTree}>
            {parentCategories.map((parent) => {
              const children = getChildrenOf(parent._id);
              const hasChildren = children.length > 0;
              const isParentChecked = selectedCategories.includes(parent.name);

              return (
                <div key={parent._id} className={styles.categoryGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={isParentChecked}
                      onChange={() => handleCategory(parent.name)}
                    />
                    <span className={styles.parentName}>{parent.name}</span>
                  </label>

                  {hasChildren && (
                    <div className={styles.categoryChildren}>
                      {children.map((child) => (
                        <label
                          key={child._id}
                          className={styles.checkbox}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(
                              child.name
                            )}
                            onChange={() => handleCategory(child.name)}
                          />
                          <span className={styles.childName}>{child.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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

    </aside>
  );
}