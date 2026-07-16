"use client";

import Link from "next/link";
import styles from "./categoryBar.module.css";
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

export default function CategoryBar() {
    return (
        <section className={styles.categoryBar}>
            <div className={styles.container}>
                <div className={styles.list}>
                    {categories.map((category, index) => (
                        <Link
                            href={`/products?category=${category.name.toLowerCase()}`}
                            key={index}
                            className={styles.item}
                        >
                            <div className={styles.iconWrapper}>
                                {category.icon}
                            </div>
                            <span className={styles.name}>{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}