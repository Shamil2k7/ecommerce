"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

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
      console.error(err);
    }
  };

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.nav}>
            <button className="category-prev" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>

            <button className="category-next" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".category-prev",
            nextEl: ".category-next",
          }}
          autoplay={{
            delay: 25,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          loop={categories.length > 6}
          grabCursor={true}
          slidesPerView={6}
          spaceBetween={12}
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
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 8,
            },
            576: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            360: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            0: {
              slidesPerView: 2.6,
              spaceBetween: 8,
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
                    className={styles.image}
                    sizes="(max-width:768px) 80px, 120px"
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