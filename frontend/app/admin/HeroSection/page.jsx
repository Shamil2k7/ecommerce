"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./HeroSection.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function HeroSectionsPage() {
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/hero-sections`
      );

      setHeroSections(res.data.heroSections || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load Hero Sections");
    } finally {
      setLoading(false);
    }
  };

  const deleteHero = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Delete Hero Section?",
      text: "Are you sure you want to delete this Hero Section?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axios.delete(
        `${API}/api/marketing/hero-sections/${id}`
      );

      toast.success("Hero Section deleted successfully!");
      fetchHeroSections();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hero Sections</h1>

        <div className={styles.actions}>
          <Link
            href="/admin/HeroSection/add"
            className={styles.addBtn}
          >
            <Plus size={18} />
            Add Hero Section
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand</th>
              <th>Display Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {heroSections.length > 0 ? (
              heroSections.map((hero) => (
                <tr key={hero._id}>
                  <td>
                    <img
                      src={hero.image}
                      alt={hero.brand}
                      className={styles.image}
                    />
                  </td>

                  <td>{hero.brand}</td>

                  <td>{hero.displayOrder}</td>

                  <td>
                    <span
                      className={
                        hero.status === "Active"
                          ? styles.active
                          : styles.inactive
                      }
                    >
                      {hero.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.buttons}>
                      <Link
                        href={`/admin/HeroSection/edit/${hero._id}`}
                        className={styles.edit}
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        className={styles.delete}
                        onClick={() => deleteHero(hero._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Hero Sections Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}