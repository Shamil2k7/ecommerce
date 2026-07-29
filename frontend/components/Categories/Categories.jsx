"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import styles from "./Categories.module.css";

export default function Categories() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch(`${API}/api/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        const activeCategories = data.data.filter(
          (category) => !category.parentCategory && category.isActive
        );

        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  }

  const sliderCategories = useMemo(() => {
    if (!categories.length) return [];

    const items = [];

    while (items.length < 24) {
      items.push(...categories);
    }

    return items.slice(0, 24);
  }, [categories]);

  if (loading || sliderCategories.length === 0) return null;

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Shop by Category</h2>

          <Link href="/products" className={styles.viewAll}>
            View All →
          </Link>
        </div>

        <Swiper
          modules={[Autoplay]}
          loop={true}
          grabCursor={true}
          speed={600}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 10,
            },

            480: {
              slidesPerView: 2.3,
              spaceBetween: 12,
            },

            640: {
              slidesPerView: 3,
              spaceBetween: 15,
            },

            768: {
              slidesPerView: 4,
              spaceBetween: 18,
            },

            992: {
              slidesPerView: 5,
              spaceBetween: 20,
            },

            1200: {
              slidesPerView: 6,
              spaceBetween: 24,
            },

            1400: {
              slidesPerView: 7,
              spaceBetween: 24,
            },
          }}
        >
          {sliderCategories.map((category, index) => (
            <SwiperSlide key={`${category._id}-${index}`}>
              <Link
                href={`/products?category=${category.slug}`}
                className={styles.category}
              >
                <div className={styles.card}>
                  <div className={styles.imageBox}>
                    <Image
                      src={category.image?.url || "/placeholder-category.png"}
                      alt={category.name}
                      fill
                      className={styles.image}
                      sizes="(max-width:480px) 50vw,
                             (max-width:768px) 33vw,
                             (max-width:1200px) 20vw,
                             180px"
                    />
                  </div>
                </div>

                <h3 className={styles.title}>{category.name}</h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}