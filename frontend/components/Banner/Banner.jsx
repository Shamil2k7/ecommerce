"use client";

import styles from "./Banner.module.css";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const banners = [
    "/offerbanner1.jfif",
    "/offerbanner1.jfif",
    "/offerbanner1.jfif",
    "/offerbanner1.jfif",

];

export default function Banner() {
    return (
        <section className={styles.bannerSection}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                navigation
                pagination={{ clickable: true }}
                className={styles.slider}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            className={styles.bannerImage}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}