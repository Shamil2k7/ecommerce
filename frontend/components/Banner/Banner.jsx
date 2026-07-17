"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Banner.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Banner() {
  const [banners, setBanners] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/banners`
      );

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
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={banners.length > 1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
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
    </section>
  );
}