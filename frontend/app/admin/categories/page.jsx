"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

import styles from "./Categories.module.css";

export default function CategoriesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch categories
        fetch("http://localhost:5000/api/categories")
            .then((res) => res.json())
            .then((json) => {
                if (json.data) {
                    setCategories(json.data);
                }
            })
            .catch((err) => console.error("Error loading categories:", err))
            .finally(() => setLoading(false));

        // Fetch products to count them
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((json) => {
                if (json.data && json.data.products) {
                    setProducts(json.data.products);
                }
            })
            .catch((err) => console.error("Error loading products:", err));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setCategories((prev) => prev.filter((cat) => cat._id !== id));
            } else {
                alert("Failed to delete category");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting category");
        }
    };

    const getProductCount = (categoryId) => {
        return products.filter((p) => {
            const pCatId = typeof p.category === "object" ? p.category?._id : p.category;
            return pCatId === categoryId;
        }).length;
    };

    const filtered = categories.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className={styles.container}>
            {/* Header */}

            <div className={styles.header}>
                <div>
                    <h1>Categories</h1>
                    <p>Manage your product categories</p>
                </div>

                <Link href="/admin/categories/add" className={styles.addBtn}>
                    <Plus size={18} />
                    Add Category
                </Link>
            </div>

            {/* Search */}

            <div className={styles.searchBox}>
                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}

            <div className={styles.table}>
                <table>

                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Parent</th>
                            <th>Products</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                    Loading categories...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map((item) => {
                                const parentName = typeof item.parentCategory === "object" && item.parentCategory
                                    ? item.parentCategory.name
                                    : (item.parentCategory
                                        ? (categories.find(c => c._id === item.parentCategory)?.name || "-")
                                        : "-");
                                return (
                                    <tr key={item._id}>

                                        <td>
                                            <img
                                                src={item.image?.url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"}
                                                alt={item.name}
                                                className={styles.image}
                                            />
                                        </td>

                                        <td>{item.name}</td>

                                        <td>{item.slug}</td>

                                        <td>{parentName}</td>

                                        <td>{getProductCount(item._id)}</td>

                                        <td>
                                            <span
                                                className={
                                                    item.isActive !== false
                                                        ? styles.active
                                                        : styles.inactive
                                                }
                                            >
                                                {item.isActive !== false ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td>

                                            <div className={styles.actions}>

                                                <button title="Edit" onClick={() => router.push(`/admin/categories/edit/${item._id}`)}>
                                                    <Pencil size={18} />
                                                </button>

                                                <button title="Delete" onClick={() => handleDelete(item._id)}>
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                    No categories found.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>
        </section>
    );
}