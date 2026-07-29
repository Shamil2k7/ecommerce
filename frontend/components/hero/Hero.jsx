"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Hero.module.css";

const AUTO_SLIDE = 4000;

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        const res = await fetch(
          `${API}/api/marketing/hero-sections`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        const activeSlides = (data.heroSections || []).filter(
          (item) => item.status === "Active"
        );

        setSlides(activeSlides);
      } catch (err) {
        console.error("Hero Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSections();
  }, [API]);


  const nextSlide = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

 
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };


  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, AUTO_SLIDE);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className={styles.hero}>
        <div className={styles.loader}>
          Loading...
        </div>
      </section>
    );
  }

  if (!slides.length) return null;

  return (
    <section className={styles.hero}>
      <div className={styles.carouselWrapper}>
   
        <button
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={28} />
        </button>

    
        <div className={styles.sliderWindow}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                className={styles.slide}
                key={slide._id || index}
              >
                <Image
                  src={slide.image}
                  alt={slide.title || "Hero Banner"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={styles.bannerImage}
                />

                {/* Optional Overlay */}
                <div className={styles.overlay}></div>
              </div>
            ))}
          </div>
        </div>

    
        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          <ChevronRight size={28} />
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