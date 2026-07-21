"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./Categories.module.css";

export default function Categories() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Collection List</h2>

          <div className={styles.nav}>
            <button className="category-prev">←</button>
            <button className="category-next">→</button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".category-prev",
            nextEl: ".category-next",
          }}
          slidesPerView={6}
          spaceBetween={12}
          loop={categories.length > 6}
          grabCursor={true}
          centeredSlides={false}
          watchOverflow={true}
          breakpoints={{
            1400: {
              slidesPerView: 8,
              spaceBetween: 6,
            },
            1200: {
              slidesPerView: 7,
              spaceBetween: 6,
            },
            992: {
              slidesPerView: 6,
              spaceBetween: 4,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 4,
            },
            576: {
              slidesPerView: 4,
              spaceBetween: 4,
            },
            360: {
              slidesPerView: 3,
              spaceBetween: 4,
            },
            0: {
              slidesPerView: 2.6,
              spaceBetween: 2,
            },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link
                href={`/products?category=${category.slug}`}
                className={styles.card}
              >
                <div className={styles.imageBox}>
                  <Image
                    src={category.image?.url || "/placeholder-category.jpg"}
                    alt={category.name}
                    fill
                    sizes="(max-width: 360px) 56px, (max-width: 480px) 66px, (max-width: 768px) 82px, (max-width: 992px) 100px, (max-width: 1200px) 115px, 130px"
                    className={styles.image}
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