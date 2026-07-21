"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images-static.nykaa.com/uploads/9ff20482-b3a3-47a0-a77e-20a21ebed482.gif",
    link: "/products",
  },
  {
    image:
      "https://images.meesho.com/images/marketing/1767796583251.webp",
    link: "/products",
  },
  {
    image:
      "https://images-static.nykaa.com/uploads/f17ab271-823f-4999-8366-d59d55e9330b.jpg?tr=cm-pad_resize,w-1800",
    link: "/products",
  },
  {
    image:
      "https://images-static.nykaa.com/uploads/08816e89-4d70-4993-afbf-e4bf87dec38c.jpg?tr=cm-pad_resize,w-1800",
    link: "/products",
  },
];

const AUTO_SLIDE = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_SLIDE);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className={styles.hero}>
      <div className={styles.carouselWrapper}>
        <button
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={prevSlide}
        >
          <ChevronLeft size={26} />
        </button>

        <div className={styles.sliderWindow}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div className={styles.slide} key={index}>
                <Link href={slide.link}>
                  <img
                    src={slide.image}
                    alt={`Banner ${index + 1}`}
                    className={styles.bannerImage}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={nextSlide}
        >
          <ChevronRight size={26} />
        </button>

        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`${styles.dot} ${
                current === index ? styles.active : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}