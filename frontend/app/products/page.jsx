"use client";

import { useMemo, useState} from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard/ProductCard";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import productsDataMock from "@/data/products";

import styles from "./ProductsPage.module.css";

export default function ProductsContent() {
  const searchParams = useSearchParams();

  // Get category from URL
  // Example: /products?category=Electronics
  const initialCategory = searchParams.get("category") || "";

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${apiBase}/api/products`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.products) {
          const mapped = json.data.products.map((p) => {
            const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
            const price = hasDiscount ? p.discountPrice : p.price;
            const oldPrice = hasDiscount ? p.price : null;
            const discount = hasDiscount ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : null;
            const rawImage = p.images?.[0]?.url || "/images/headphone.png";
            const imageUrl = rawImage.startsWith("/uploads") ? `${apiBase}${rawImage}` : rawImage;
            return {
              id: p._id,
              name: p.name,
              category: typeof p.category === "object" ? p.category?.name : "Accessories",
              brand: typeof p.brand === "object" ? p.brand?.name : (p.brand || "Unknown"),
              image: imageUrl,
              price: price,
              oldPrice: oldPrice,
              discount: discount,
              rating: p.ratingsAverage || 5,
              reviews: p.ratingsCount || 0,
            };
          });
          setProductsData(mapped);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch products, using static mock fallback:", err.message);
        setProductsData(productsDataMock);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let data = [...productsData];

    // Search
    if (search.trim()) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      data = data.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // Brand
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
        data.sort((a, b) => b.id - a.id);
        break;

      default:
        break;
    }

    return data;
  }, [productsData, search, selectedCategories, selectedBrands, sortBy]);

  return (
    <main className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>Home / Products</div>

      {/* Top Bar */}
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
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        <FilterSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />

        <div className={styles.productsGrid}>
          {loading ? (
            <div className={styles.empty}>
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
