"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    brand: "Eucerin",
    offer: "Upto 15% Off",
    subOffer: "Anti-Pigment Duo!",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
  },
  {
    brand: "ISDIN",
    offer: "Most Loved",
    subOffer: "Ultralight SPF",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900",
  },
  {
    brand: "URIAGE",
    offer: "Made in France",
    subOffer: "Dermat Recommended",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900",
  },
  {
    brand: "Minimalist",
    offer: "Buy 2 Get 1 Free",
    subOffer: "On All Serums",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900",
  },
  {
    brand: "Kay Beauty",
    offer: "Up To 20% Off",
    subOffer: "On Katrina's Faves!",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
  },
];

const CARD_GAP = 16;
const AUTO_SCROLL_DELAY = 3000;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);

  const windowRef = useRef(null);
  const maxIndex = slides.length - visibleCount;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Measure the visible window and figure out how many cards show + exact card width
  useEffect(() => {
    const measure = () => {
      if (!windowRef.current) return;
      const containerWidth = windowRef.current.offsetWidth;

      let count = 3;
      if (window.innerWidth <= 768) count = 1;
      else if (window.innerWidth <= 1200) count = 2;

      const totalGap = CARD_GAP * (count - 1);
      const width = (containerWidth - totalGap) / count;

      setVisibleCount(count);
      setCardWidth(width);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Clamp currentIndex if visibleCount changes (e.g. resize) and it's now out of range
  useEffect(() => {
    const newMax = slides.length - visibleCount;
    if (currentIndex > newMax) setCurrentIndex(Math.max(newMax, 0));
  }, [visibleCount, currentIndex]);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  return (
    <section className={styles.hero}>
      <div
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.sliderWindow} ref={windowRef}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + CARD_GAP)}px)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={styles.bannerCard}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  flex: `0 0 ${cardWidth}px`,
                }}
              >
                <div className={styles.overlay}></div>

                <div className={styles.brand}>{slide.brand}</div>

                <div className={styles.content}>
                  <div>
                    <h2>{slide.offer}</h2>
                    <p>{slide.subOffer}</p>
                  </div>

                  <Link href="/products" className={styles.shopBtn}>
                    Shop Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}