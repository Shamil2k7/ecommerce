"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import styles from "./Products.module.css";

const productData = [
  {
    id: 1,
    image: "/products/shoe.jpg",
    name: "Nike Air Max",
    category: "Shoes",
    brand: "Nike",
    price: 5999,
    stock: 24,
    status: "Active",
  },
  {
    id: 2,
    image: "/products/iphone.jpg",
    name: "iPhone 16 Pro",
    category: "Electronics",
    brand: "Apple",
    price: 129999,
    stock: 12,
    status: "Active",
  },
  {
    id: 3,
    image: "/products/headphone.jpg",
    name: "Sony WH-1000XM5",
    category: "Electronics",
    brand: "Sony",
    price: 28999,
    stock: 5,
    status: "Low Stock",
  },
  {
    id: 4,
    image: "/products/tshirt.jpg",
    name: "Oversized T-Shirt",
    category: "Fashion",
    brand: "H&M",
    price: 999,
    stock: 0,
    status: "Out of Stock",
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = productData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.products}>

      {/* Header */}

      <div className={styles.header}>

        <div>
          <h1>Products</h1>
          <p>Manage all products</p>
        </div>

        <button className={styles.addBtn} onClick={() => window.location.href = "/admin/products/add"}>
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

        <select>
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Shoes</option>
        </select>

        <select>
          <option>All Brands</option>
          <option>Apple</option>
          <option>Nike</option>
          <option>Sony</option>
          <option>Samsung</option>
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

            {filteredProducts.map((product) => (

              <tr key={product.id}>

                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                  />
                </td>

                <td>{product.name}</td>

                <td>{product.category}</td>

                <td>{product.brand}</td>

                <td>
                  ₹{product.price.toLocaleString()}
                </td>

                <td>{product.stock}</td>

                <td>

                  <span
                    className={`${styles.status}
                    ${
                      product.status === "Active"
                        ? styles.active
                        : product.status === "Low Stock"
                        ? styles.low
                        : styles.out
                    }`}
                  >
                    {product.status}
                  </span>

                </td>

                <td>

                  <div className={styles.actions}>

                    <button title="View">
                      <Eye size={18} />
                    </button>

                    <button title="Edit">
                      <Pencil size={18} />
                    </button>

                    <button title="Delete">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

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

    </section>
  );
}