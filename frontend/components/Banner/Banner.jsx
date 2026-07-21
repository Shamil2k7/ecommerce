"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Banner.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const swiperRef = useRef(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    try {
      const res = await axios.get(`${API}/api/marketing/banners`);

      const activeBanners = res.data.banners
        .filter((banner) => banner.status === "Active")
        .sort((a, b) => a.displayOrder - b.displayOrder);

      setBanners(activeBanners);
    } catch (error) {
      console.error("Banner Fetch Error:", error);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className={styles.bannerSection}>
      <div className={styles.carouselWrapper}>
        <button
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft size={26} />
        </button>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          loop={banners.length > 1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className={styles.slider}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <img
                src={banner.image}
                alt="Banner"
                className={styles.bannerImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight size={26} />
        </button>
      </div>
    </section>
  );
}