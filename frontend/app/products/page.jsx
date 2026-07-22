"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard/ProductCard";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";

import styles from "./ProductsPage.module.css";

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

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        setCategoriesList(json.data || []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
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
        console.warn(
          "Failed to fetch products:",
          err.message
        );

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
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory]);

  const expandedSelectedCategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    const result = new Set();
    selectedCategories.forEach((catName) => {
      result.add(catName);

      // Find if this is a parent category
      const parentCat = categoriesList.find(
        (c) => c.name === catName && !c.parentCategory
      );
      if (parentCat) {
        // Find all child categories of this parent category
        const children = categoriesList.filter((c) => {
          const pId = typeof c.parentCategory === "object" && c.parentCategory
            ? c.parentCategory._id
            : c.parentCategory;
          return pId === parentCat._id;
        });
        children.forEach((child) => result.add(child.name));
      }
    });
    return Array.from(result);
  }, [selectedCategories, categoriesList]);

  const filteredProducts = useMemo(() => {
    let data = [...productsData];

    // Search
    if (search.trim()) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category Filter
    if (expandedSelectedCategories.length > 0) {
      data = data.filter((item) =>
        expandedSelectedCategories.includes(item.category)
      );
    }

    // Brand Filter
    if (selectedBrands.length > 0) {
      data = data.filter((item) =>
        selectedBrands.includes(item.brand)
      );
    }

    // Sorting
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
        data.sort((a, b) =>
          String(b.id).localeCompare(String(a.id))
        );
        break;

      default:
        break;
    }

    return data;
  }, [
    productsData,
    search,
    selectedCategories,
    selectedBrands,
    sortBy,
  ]);

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        Home / Products
      </div>

      <div className={styles.topBar}>
        <div>
          <h1>All Products</h1>
          <p>Showing {filteredProducts.length} Products</p>
        </div>

        <div className={styles.actions}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="priceLow">
              Price Low → High
            </option>
            <option value="priceHigh">
              Price High → Low
            </option>
            <option value="rating">
              Highest Rated
            </option>
          </select>
        </div>
      </div>

      <div className={styles.layout}>
        <FilterSidebar
          categoriesList={categoriesList}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />

        <div className={styles.productsGrid}>
          {loading ? (
            <div className={styles.empty}>
              <h2>Loading products...</h2>
              <p>
                Fetching the latest catalog from our
                backend.
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className={styles.empty}>
              <h2>No Products Found</h2>
              <p>
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className={styles.page}>
        <div className={styles.breadcrumb}>Home / Products</div>
        <div className={styles.topBar}>
          <div>
            <h1>All Products</h1>
            <p>Loading Products...</p>
          </div>
        </div>
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}