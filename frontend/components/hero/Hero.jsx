"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";
import {
    Laptop,
    Shirt,
    Footprints,
    Sparkles,
    House,
    Watch,
    Gamepad2,
    Dumbbell,
    Baby,
    Smartphone,
    BookOpen,
    Sofa,
    ShoppingBag,
} from "lucide-react";
const categories = [
    { icon: <Laptop size={20} />, name: "Electronics" },
    { icon: <Smartphone size={20} />, name: "Mobiles" },
    { icon: <Shirt size={20} />, name: "Fashion" },
    { icon: <Footprints size={20} />, name: "Footwear" },
    { icon: <Sparkles size={20} />, name: "Beauty" },
    { icon: <House size={20} />, name: "Home & Kitchen" },
    { icon: <Sofa size={20} />, name: "Furniture" },
    { icon: <Watch size={20} />, name: "Accessories" },
    { icon: <Gamepad2 size={20} />, name: "Gaming" },
    { icon: <Dumbbell size={20} />, name: "Sports" },
    { icon: <BookOpen size={20} />, name: "Books" },
    { icon: <Baby size={20} />, name: "Kids" },
    { icon: <ShoppingBag size={20} />, name: "Bags" },
];
const slides = [
    {
        title: "Summer Collection",
        subtitle: "Up To 50% OFF",
        description:
            "Discover premium fashion, electronics, footwear and accessories with exclusive discounts for a limited time.",
        image:
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
    },
    {
        title: "Latest Electronics",
        subtitle: "Save Up To 40%",
        description:
            "Upgrade your lifestyle with smartphones, laptops, headphones and smart gadgets.",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900",
    },
    {
        title: "Fashion Trends",
        subtitle: "New Collection",
        description:
            "Premium fashion for men and women with the latest seasonal styles.",
        image:
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
    },
];
export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(timer);
    }, [currentSlide]);
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                {/* ================= Left Categories ================= */}

                <aside className={styles.sidebar}>
                    <h3>Categories</h3>

                    <ul>
                        {categories.map((item, index) => (
                            <li key={index}>
                                <Link href="/products">
                                    <span>{item.icon}</span>

                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* ================= Banner ================= */}

                <div className={styles.banner}>
                    {/* Left Content */}

                    <div className={styles.content}>
                        <span className={styles.badge}>
                            🔥 NEW ARRIVALS
                        </span>

                        <h1>
                            {slides[currentSlide].title}
                            <br />
                            <span>{slides[currentSlide].subtitle}</span>
                        </h1>

                        <p>{slides[currentSlide].description}</p>

                        <div className={styles.buttons}>
                            <Link
                                href="/products"
                                className={styles.shopBtn}
                            >
                                Shop Now →
                            </Link>

                            <Link
                                href="/categories"
                                className={styles.outlineBtn}
                            >
                                Explore
                            </Link>
                        </div>

                        {/* Stats */}

                        <div className={styles.stats}>
                            <div>
                                <h3>15K+</h3>
                                <p>Products</p>
                            </div>

                            <div>
                                <h3>8K+</h3>
                                <p>Happy Customers</p>
                            </div>

                            <div>
                                <h3>4.9★</h3>
                                <p>Ratings</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}

                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                    />

                    {/* Slider Controls */}

                    <button className={styles.leftArrow} />
                    <button className={styles.rightArrow} />


                    {/* Slider Dots */}

                    <div className={styles.dots}>
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={
                                    currentSlide === index
                                        ? styles.active
                                        : ""
                                }
                                onClick={() => setCurrentSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}