"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSectionsPage() {
  const [heroSections, setHeroSections] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchHeroSections();
  }, []);

  useEffect(() => {
    const filtered = heroSections.filter(
      (hero) =>
        hero.brand.toLowerCase().includes(search.toLowerCase()) ||
        hero.offer.toLowerCase().includes(search.toLowerCase()) ||
        hero.subOffer.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredHeroes(filtered);
  }, [search, heroSections]);

  const fetchHeroSections = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/hero-sections`
      );

      setHeroSections(res.data.heroSections || []);
      setFilteredHeroes(res.data.heroSections || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load Hero Sections");
    } finally {
      setLoading(false);
    }
  };

  const deleteHero = async (id) => {
    if (!confirm("Delete this Hero Section?")) return;

    try {
      await axios.delete(
        `${API}/api/marketing/hero-sections/${id}`
      );

      fetchHeroSections();
    } catch (err) {
      alert("Delete failed");
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
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search Hero Sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
              {/* <th>Offer</th>
              <th>Sub Offer</th> */}
              <th>Display Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredHeroes.length > 0 ? (
              filteredHeroes.map((hero) => (
                <tr key={hero._id}>
                  <td>
                    <img
                      src={hero.image}
                      alt={hero.brand}
                      className={styles.image}
                    />
                  </td>

                  <td>{hero.brand}</td>

                  {/* <td>{hero.offer}</td>

                  <td>{hero.subOffer}</td> */}

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
                <td colSpan="7" style={{ textAlign: "center" }}>
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