"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import styles from "./Products.module.css";

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.products) {
          setProductData(json.data.products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));

    // Fetch brands
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setBrands(json.data);
        }
      })
      .catch((err) => console.error("Error fetching brands:", err));

    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProductData((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const filteredProducts = productData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const itemCategoryName =
      typeof item.category === "object"
        ? item.category?.name
        : item.category;

    const itemBrandName =
      typeof item.brand === "object"
        ? item.brand?.name
        : item.brand;

    const matchesCategory =
      selectedCategory === "All Categories" ||
      itemCategoryName === selectedCategory;

    const matchesBrand =
      selectedBrand === "All Brands" ||
      itemBrandName === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <section className={styles.products}>

      {/* Header */}

      <div className={styles.header}>

        <div>
          <h1>Products</h1>
          <p>Manage all products</p>
        </div>

        <button className={styles.addBtn} onClick={() => router.push("/admin/products/add")}>
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* Top Controls */}

      <div className={styles.controls}>

        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All Categories">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="All Brands">All Brands</option>

          {brands.map((brand) => (
            <option key={brand._id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>

      </div>

      {/* Table */}

      <div className={styles.tableContainer}>

        <table>

          <thead>

            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (

                <tr key={product._id}>

                  <td>
                    <img
                      src={product.images?.[0]?.url || "/images/headphone.png"}
                      alt={product.name}
                      className={styles.image}
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>
                    {product.category?.name || product.category || "-"}
                  </td>

                  <td>
                    {product.brand?.name || product.brand || "-"}
                  </td>

                  <td>
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td>{product.stock}</td>

                  <td>

                    <span
                      className={`${styles.status}
                      ${product.stock > 10
                          ? styles.active
                          : product.stock > 0
                            ? styles.low
                            : styles.out
                        }`}
                    >
                      {product.stock > 10 ? "Active" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </span>

                  </td>

                  <td>

                    <div className={styles.actions}>

                      <button
                        title="View"
                        onClick={() => handleView(product)}
                      >
                        <Eye size={18} />
                      </button>

                      <button title="Edit" onClick={() => router.push(`/admin/products/edit/${product._id}`)}>
                        <Pencil size={18} />
                      </button>

                      <button title="Delete" onClick={() => handleDelete(product._id)}>
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No products found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className={styles.pagination}>

        <button>Previous</button>

        <button className={styles.activePage}>
          1
        </button>

        <button>2</button>

        <button>3</button>

        <button>Next</button>

      </div>
      {showModal && selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <button
              className={styles.closeBtn}
              onClick={closeModal}
            >
              ×
            </button>

            <div className={styles.modalContent}>

              <img
                src={
                  selectedProduct.images?.[0]?.url ||
                  "/images/headphone.png"
                }
                alt={selectedProduct.name}
                className={styles.modalImage}
              />

              <div className={styles.modalInfo}>

                <h2>{selectedProduct.name}</h2>

                <p>
                  <strong>Category:</strong>{" "}
                  {selectedProduct.category?.name ||
                    selectedProduct.category}
                </p>

                <p>
                  <strong>Brand:</strong>{" "}
                  {selectedProduct.brand?.name ||
                    selectedProduct.brand ||
                    "-"}
                </p>

                <p>
                  <strong>Price:</strong> ₹
                  {selectedProduct.price}
                </p>

                <p>
                  <strong>Stock:</strong>{" "}
                  {selectedProduct.stock}
                </p>

                <p>
                  <strong>Description:</strong>
                </p>

                <p>
                  {selectedProduct.description ||
                    "No description"}
                </p>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}