"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import styles from "./HeroSection.module.css";

export default function HeroSectionsPage() {
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API =
    process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/hero-sections`,
        {
          withCredentials: true,
        }
      );

      setHeroSections(res.data.heroSections || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to load Hero Sections"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteHero = async (id) => {
    const result = await Swal.fire({
      title: "Delete Hero Section?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      console.log("Deleting:", id);

      const res = await axios.delete(
        `${API}/api/marketing/hero-sections/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      setHeroSections((prev) =>
        prev.filter((hero) => hero._id !== id)
      );

      toast.success(
        res.data.message ||
          "Hero Section deleted successfully!"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete Hero Section"
      );
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hero Sections</h1>

        <Link
          href="/admin/HeroSection/Add"
          className={styles.addBtn}
        >
          <Plus size={18} />
          Add Hero Section
        </Link>
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
            {heroSections.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center" }}
                >
                  No Hero Sections Found
                </td>
              </tr>
            ) : (
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
                        type="button"
                        className={styles.delete}
                        onClick={() => deleteHero(hero._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}