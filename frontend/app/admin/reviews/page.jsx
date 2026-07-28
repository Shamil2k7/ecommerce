"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

import styles from "./Reviews.module.css";



const API = process.env.NEXT_PUBLIC_API_URL;


export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = reviews.filter((item) =>
    item.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );
  useEffect(() => {
    fetchReviews();
  }, []);


  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/reviews`,
        {
          withCredentials: true,
        }
      );

      console.log(data);

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Reviews</h1>
          <p>Manage customer reviews</p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search review..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>No Reviews Found</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.product}>
                      
                     

                      <span>{item.productName}</span>
                    </div>
                  </td>

                  <td>{item.customer}</td>

                  <td>
                    <div className={styles.rating}>
                      <Star
                        size={16}
                        fill="#facc15"
                        color="#facc15"
                      />
                      {item.rating}/5
                    </div>
                  </td>

                  {/* <td className={styles.review}>
                    {item.review}
                  </td> */}

                  <td>
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Published"
                          ? styles.active
                          : styles.pending
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button>
                        <Eye size={18} />
                      </button>

                      <Link href={`/admin/reviews/edit/${item.id}`}>
                        <Pencil size={18} />
                      </Link>

                      <button>
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
    </section>
  );
}