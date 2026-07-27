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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API}/api/categories`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.success) {
        const activeCategories = [];

        for (const category of result.data) {
          if (category.parentCategory) continue;
          if (!category.isActive) continue;

          activeCategories.push(category);
        }

        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sliderCategories = useMemo(() => {
    if (categories.length === 0) return [];

    const list = [];

    while (list.length < 24) {
      for (const category of categories) {
        list.push(category);

        if (list.length >= 24) {
          break;
        }
      }
    }

    return list;
  }, [categories]);

  if (loading) return null;

  if (sliderCategories.length === 0) return null;

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        {/* Heading */}

        <div className={styles.header}>
          <Link href="/products" className={styles.viewAll}>
            View All →
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          loop
          speed={2000}
          grabCursor
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 2.5,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
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
                      sizes="250px"
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