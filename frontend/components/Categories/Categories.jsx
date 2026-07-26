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
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await fetch(`${API}/api/categories`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.success) {
        const activeCategories = result.data.filter((item) => {
          return !item.parentCategory && item.isActive;
        });

        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sliderCategories = useMemo(() => {
    if (categories.length === 0) return [];

    let items = [...categories];

    while (items.length < 20) {
      items = [...items, ...categories];
    }

    return items;
  }, [categories]);

  if (loading) return null;
  if (sliderCategories.length === 0) return null;

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={1000}
          grabCursor={true}
          observer={true}
          observeParents={true}
          watchOverflow={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 2.3,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            576: {
              slidesPerView: 4,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 14,
            },
            992: {
              slidesPerView: 6,
              spaceBetween: 16,
            },
            1200: {
              slidesPerView: 7,
              spaceBetween: 18,
            },
            1400: {
              slidesPerView: 8,
              spaceBetween: 20,
            },
          }}
        >
          {sliderCategories.map((category, index) => (
            <SwiperSlide key={`${category._id}-${index}`}>
              <Link
                href={`/products?category=${category.slug}`}
                className={styles.card}
              >
                <div className={styles.imageBox}>
                  <Image
                    src={category.image?.url || "/placeholder-category.jpg"}
                    alt={category.name}
                    fill
                    className={styles.image}
                    sizes="(max-width:768px) 90px, 140px"
                    priority={index < 8}
                  />
                </div>

                <h3>{category.name}</h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}