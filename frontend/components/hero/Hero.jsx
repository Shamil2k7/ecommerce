"use client";

import { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
const AUTO_SLIDE = 3000;
export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;
 
  const fetchHeroSections = async () => {

    try {
      const res = await fetch(
        `${API}/api/marketing/hero-sections`
      );
      const data = await res.json();
      const activeHeroSections = data.heroSections.filter(
        (item) => item.status === "Active"
      );
      setSlides(activeHeroSections);

    } catch (error) {
      console.log(
        "Hero Section Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHeroSections();
  }, []);
  // Next-slide

  const nextSlide = () => {

    setCurrent((prev) =>
      prev === slides.length - 1
        ? 0
        : prev + 1
    );

  };
  // Previous-slide

  const prevSlide = () => {

    setCurrent((prev) =>
      prev === 0
        ? slides.length - 1
        : prev - 1
    );

  };
  // Auto-slider

  useEffect(() => {

    if (slides.length <= 1)
      return;
    const timer = setInterval(
      nextSlide,
      AUTO_SLIDE
    );
    return () => clearInterval(timer);
  }, [slides]);
  if (loading) {

    return (
      <section className={styles.hero}>
        Loading...
      </section>
    );

  }
  if (slides.length === 0) {

    return null;

  }
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
              transform:
                `translateX(-${current * 100}%)`
            }}
          >
            {
              slides.map((slide) => (
                <div
                  className={styles.slide}
                  key={slide._id}
                >
                  <img
                    src={slide.image}
                    alt="Hero Banner"
                    className={styles.bannerImage}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={nextSlide}
        >
          <ChevronRight size={26} />
        </button>
        <div className={styles.dots}>
          {
            slides.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrent(index)
                }
                className={
                  `${styles.dot}
                  ${current === index
                    ? styles.active
                    : ""
                  }`
                }
              />
            ))
          }
        </div>
      </div>
    </section>
  );
}