"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  const prevRef = useRef(null);
  const nextRef = useRef(null);

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
        const parentCategories = (data.data || []).filter(
          (category) =>
            !category.parentCategory &&
            category.isActive
        );

        setCategories(parentCategories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Duplicate categories for smooth loop
  const swiperCategories = useMemo(() => {
    if (!categories.length) return [];

    let arr = [...categories];

    while (arr.length < 20) {
      arr = [...arr, ...categories];
    }

    return arr;
  }, [categories]);

  if (!swiperCategories.length) return null;

  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.header}>

        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={6}
          spaceBetween={12}
          loop={true}
          speed={900}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          grabCursor={true}
          observer={true}
          observeParents={true}
          watchOverflow={false}
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
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {swiperCategories.map((category, index) => (
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