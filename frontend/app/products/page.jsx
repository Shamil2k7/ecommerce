"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiFilter,
  FiSliders,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

import ProductCard from "@/components/ProductCard/ProductCard";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";

import styles from "./ProductsPage.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [sortBy, setSortBy] = useState("popular");
  const [search, setSearch] = useState("");

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategoriesList(json.data || []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const json = await res.json();

        if (json.data?.products) {
          const mapped = json.data.products.map((p) => {
            const hasDiscount =
              p.discountPrice &&
              p.discountPrice > 0 &&
              p.discountPrice < p.price;

            return {
              id: p._id,
              name: p.name,
              category:
                typeof p.category === "object"
                  ? p.category?.name
                  : p.category || "Uncategorized",

              categorySlug:
                typeof p.category === "object"
                  ? p.category?.slug
                  : "",

              categorySlug:
                typeof p.category === "object"
                  ? p.category?.slug
                  : "",
              brand:
                typeof p.brand === "object"
                  ? p.brand?.name
                  : p.brand || "",
              image:
                p.images?.length > 0
                  ? p.images[0].url
                  : "/images/headphone.png",
              price: hasDiscount ? p.discountPrice : p.price,
              oldPrice: hasDiscount ? p.price : null,
              discount: hasDiscount
                ? Math.round(
                  ((p.price - p.discountPrice) / p.price) * 100
                )
                : null,
              rating: p.ratingsAverage || 5,
              reviews: p.ratingsCount || 0,
            };
          });

          setProductsData(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch products:", err.message);
        try {
          const mod = await import("@/data/products");
          setProductsData(mod.default);
        } catch (e) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      const decodedCategory = decodeURIComponent(initialCategory);
      if (categoriesList.length > 0) {
        const cat = categoriesList.find(
          (c) =>
            c.slug.toLowerCase() === decodedCategory.toLowerCase() ||
            c.name.toLowerCase() === decodedCategory.toLowerCase()
        );
        if (cat) {
          const names = [cat.name];
          const isParent = !cat.parentCategory;
          if (isParent) {
            const children = categoriesList.filter((c) => {
              const pId =
                typeof c.parentCategory === "object" && c.parentCategory
                  ? c.parentCategory._id
                  : c.parentCategory;
              return pId === cat._id;
            });
            children.forEach((child) => names.push(child.name));
          }
          setSelectedCategories(names);
          return;
        }
      }
      setSelectedCategories([decodedCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory, categoriesList]);

  const expandedSelectedCategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    const result = new Set();
    selectedCategories.forEach((catName) => {
      const cat = categoriesList.find(
        (c) =>
          c.name.toLowerCase() === catName.toLowerCase() ||
          c.slug.toLowerCase() === catName.toLowerCase()
      );
      if (cat) {
        result.add(cat.name);
        result.add(cat.slug);

        const isParent = !cat.parentCategory;
        if (isParent) {
          const children = categoriesList.filter((c) => {
            const pId =
              typeof c.parentCategory === "object" && c.parentCategory
                ? c.parentCategory._id
                : c.parentCategory;
            return pId === cat._id;
          });
          children.forEach((child) => {
            result.add(child.name);
            result.add(child.slug);
          });
        }
      } else {
        result.add(catName);
      }
    });
    return Array.from(result);
  }, [selectedCategories, categoriesList]);

  const filteredProducts = useMemo(() => {
    let data = [...productsData];

    if (search.trim()) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (expandedSelectedCategories.length > 0) {
      data = data.filter((item) =>
        expandedSelectedCategories.some(
          (cat) =>
            cat.toLowerCase() === item.category.toLowerCase() ||
            (item.categorySlug && cat.toLowerCase() === item.categorySlug.toLowerCase())
        )
      );
    }

    if (selectedBrands.length > 0) {
      data = data.filter((item) => selectedBrands.includes(item.brand));
    }

    switch (sortBy) {
      case "priceLow":
        data.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        data.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        data.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        data.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
      default:
        break;
    }

    return data;
  }, [productsData, search, expandedSelectedCategories, selectedBrands, sortBy]);

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (search ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearch("");
  };

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>Home / Products</div>

      {/* Header Top Section */}
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <h1>All Products</h1>
          <p>Showing {filteredProducts.length} Products</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <FiChevronDown className={styles.selectArrow} />
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar on Mobile */}
      <div className={styles.mobileFilterBar}>
        <div className={styles.mobileFilterItem}>
          <FiSliders size={16} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Sort By</option>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Rating</option>
          </select>
          <FiChevronDown size={14} />
        </div>

        <button
          type="button"
          className={styles.mobileFilterBtn}
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <FiFilter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={styles.filterBadge}>{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className={styles.layout}>
        {/* Desktop Sidebar */}
        <aside className={styles.desktopSidebar}>
          <FilterSidebar
            categoriesList={categoriesList}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        </aside>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {loading ? (
            <div className={styles.empty}>
              <div className={styles.spinner} />
              <h2>Loading products...</h2>
              <p>Fetching the latest catalog from our backend.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.empty}>
              <h2>No Products Found</h2>
              <p>Try changing your search or filters.</p>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsMobileFilterOpen(false)}>
          <div
            className={styles.filterDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3>Filter Products</h3>
              <div className={styles.drawerHeaderActions}>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  className={styles.closeDrawerBtn}
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className={styles.drawerBody}>
              <FilterSidebar
                categoriesList={categoriesList}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
              />
            </div>

            <div className={styles.drawerFooter}>
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className={styles.breadcrumb}>Home / Products</div>
          <div className={styles.topBar}>
            <div>
              <h1>All Products</h1>
              <p>Loading Products...</p>
            </div>
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
