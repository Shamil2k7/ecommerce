"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Star } from "lucide-react";
import styles from "./AddReview.module.css"

export default function EditReviewPage() {
  const [review, setReview] = useState({
    product: "iPhone 16 Pro",
    customer: "John Smith",
    rating: 5,
    review: "Excellent phone. Amazing camera quality and battery backup.",
    status: "Published",
  });

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/reviews" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Reviews
          </Link>

          <h1>Edit Review</h1>
          <p>Update customer review.</p>
        </div>
      </div>

      <form className={styles.form}>
        <div className={styles.field}>
          <label>Product</label>

          <input
            value={review.product}
            onChange={(e) =>
              setReview({ ...review, product: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label>Customer</label>

          <input
            value={review.customer}
            onChange={(e) =>
              setReview({ ...review, customer: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label>Rating</label>

          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={styles.star}
                onClick={() =>
                  setReview({ ...review, rating: star })
                }
              >
                <Star
                  size={28}
                  fill={
                    star <= review.rating
                      ? "#facc15"
                      : "transparent"
                  }
                  color="#facc15"
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label>Review</label>

          <textarea
            rows={6}
            value={review.review}
            onChange={(e) =>
              setReview({ ...review, review: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>

          <select
            value={review.status}
            onChange={(e) =>
              setReview({ ...review, status: e.target.value })
            }
          >
            <option>Published</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.delete}
          >
            <Trash2 size={18} />
            Delete
          </button>

          <button
            type="reset"
            className={styles.secondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.primary}
          >
            Update Review
          </button>
        </div>
      </form>
    </section>
  );
}