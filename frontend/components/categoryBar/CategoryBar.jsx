"use client";

import Link from "next/link";
import styles from "./categoryBar.module.css";
import {
  Grid2x2,
  BadgePercent,
  Sparkles,
  Laptop,
  Smartphone,
  Shirt,
  Footprints,
  Brush,
  ShoppingBasket,
  House,
  Sofa,
  Refrigerator,
  Watch,
  ShoppingBag,
  ToyBrick,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Baby,
} from "lucide-react";

const categories = [
  {
    icon: <Grid2x2 size={20} />,
    name: "All",
  },
  {
    icon: <BadgePercent size={20} />,
    name: "Offers",
  },
  {
    icon: <Sparkles size={20} />,
    name: "New Arrivals",
  },
  {
    icon: <Laptop size={20} />,
    name: "Electronics",
  },
  {
    icon: <Smartphone size={20} />,
    name: "Mobiles",
  },
  {
    icon: <Shirt size={20} />,
    name: "Fashion",
  },
  {
    icon: <Footprints size={20} />,
    name: "Footwear",
  },
  {
    icon: <Brush size={20} />,
    name: "Beauty",
  },
  {
    icon: <ShoppingBasket size={20} />,
    name: "Grocery",
  },
  {
    icon: <House size={20} />,
    name: "Home & Kitchen",
  },
  {
    icon: <Sofa size={20} />,
    name: "Furniture",
  },
  {
    icon: <Refrigerator size={20} />,
    name: "Appliances",
  },
  {
    icon: <Watch size={20} />,
    name: "Accessories",
  },
  {
    icon: <ShoppingBag size={20} />,
    name: "Bags",
  },
  {
    icon: <ToyBrick size={20} />,
    name: "Toys",
  },
  {
    icon: <Dumbbell size={20} />,
    name: "Sports",
  },
  {
    icon: <Gamepad2 size={20} />,
    name: "Gaming",
  },
  {
    icon: <BookOpen size={20} />,
    name: "Books",
  },
  {
    icon: <Baby size={20} />,
    name: "Kids",
  },
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
              <div className={styles.iconWrapper}>{category.icon}</div>
              <span className={styles.name}>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
