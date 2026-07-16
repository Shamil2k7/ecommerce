"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard/ProductCard";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import productsDataMock from "@/data/products";

import styles from "./ProductsPage.module.css";

function ProductsContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "";

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    fetch(`${apiBase}/api/products`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.products) {
          const mapped = json.data.products.map((p) => {
            const hasDiscount =
              p.discountPrice > 0 &&
              p.discountPrice < p.price;

            return {
              id: p._id,
              name: p.name,
              category:
                typeof p.category === "object"
                  ? p.category?.name
                  : p.category,
              brand:
                typeof p.brand === "object"
                  ? p.brand?.name
                  : p.brand,
              image:
                p.images?.[0]?.url ||
                "/images/headphone.png",
              price: hasDiscount
                ? p.discountPrice
                : p.price,
              oldPrice: hasDiscount ? p.price : null,
              discount: hasDiscount
                ? Math.round(
                    ((p.price - p.discountPrice) /
                      p.price) *
                      100
                  )
                : 0,
              rating: p.ratingsAverage || 5,
              reviews: p.ratingsCount || 0,
            };
          });

          setProductsData(mapped);
        } else {
          setProductsData(productsDataMock);
        }
      })
      .catch(() => {
        setProductsData(productsDataMock);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let data = [...productsData];

    if (search) {
      data = data.filter((item) =>
        item.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length) {
      data = data.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (selectedBrands.length) {
      data = data.filter((item) =>
        selectedBrands.includes(item.brand)
      );
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
        data.sort((a, b) => b.id.localeCompare(a.id));
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
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />

        <div className={styles.productsGrid}>
          {loading ? (
            <h2>Loading...</h2>
          ) : filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className={styles.empty}>
              <h2>No Products Found</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}