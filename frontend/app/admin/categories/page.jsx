"use client";
import Link from "next/link";
import { useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

import styles from "./Categories.module.css";

const categories = [
    {
        id: 1,
        image: "/categories/electronics.jpg",
        name: "Electronics",
        slug: "electronics",
        parent: "-",
        products: 124,
        status: "Active",
    },
    {
        id: 2,
        image: "/categories/fashion.jpg",
        name: "Fashion",
        slug: "fashion",
        parent: "-",
        products: 89,
        status: "Active",
    },
    {
        id: 3,
        image: "/categories/shoes.jpg",
        name: "Shoes",
        slug: "shoes",
        parent: "Fashion",
        products: 52,
        status: "Active",
    },
    {
        id: 4,
        image: "/categories/home.jpg",
        name: "Home",
        slug: "home",
        parent: "-",
        products: 31,
        status: "Inactive",
    },
];

export default function CategoriesPage() {
    const [search, setSearch] = useState("");

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

                {/* <Link href={`/admin/categories/edit/${item.id}`}> */}
                    <button>
                        <Pencil size={18} />
                    </button>
                {/* </Link> */}
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

                        {filtered.map((item) => (
                            <tr key={item.id}>

                                <td>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.image}
                                    />
                                </td>

                                <td>{item.name}</td>

                                <td>{item.slug}</td>

                                <td>{item.parent}</td>

                                <td>{item.products}</td>

                                <td>
                                    <span
                                        className={
                                            item.status === "Active"
                                                ? styles.active
                                                : styles.inactive
                                        }
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td>

                                    <div className={styles.actions}>

                                        <button>
                                            <Pencil size={18} />
                                        </button>

                                        <button>
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>
        </section>
    );
}