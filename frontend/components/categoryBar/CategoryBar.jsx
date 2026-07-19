"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./categoryBar.module.css";

import {
  Grid2x2,
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
  Package,
} from "lucide-react";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data || []);
      })
      .catch(console.error);
  }, []);

  const getIcon = (name) => {
    const n = name.toLowerCase();

    if (n.includes("elect")) return <Laptop size={20} />;
    if (n.includes("mobile")) return <Smartphone size={20} />;
    if (n.includes("fashion")) return <Shirt size={20} />;
    if (n.includes("shoe")) return <Footprints size={20} />;
    if (n.includes("beauty")) return <Brush size={20} />;
    if (n.includes("grocery")) return <ShoppingBasket size={20} />;
    if (n.includes("home")) return <House size={20} />;
    if (n.includes("furniture")) return <Sofa size={20} />;
    if (n.includes("appliance")) return <Refrigerator size={20} />;
    if (n.includes("accessories")) return <Watch size={20} />;
    if (n.includes("bag")) return <ShoppingBag size={20} />;
    if (n.includes("toy")) return <ToyBrick size={20} />;
    if (n.includes("sport")) return <Dumbbell size={20} />;
    if (n.includes("gaming")) return <Gamepad2 size={20} />;
    if (n.includes("book")) return <BookOpen size={20} />;
    if (n.includes("kid")) return <Baby size={20} />;

    return <Package size={20} />;
  };

  return (
    <section className={styles.categoryBar}>
      <div className={styles.container}>
        <div className={styles.list}>

          <Link
            href="/products"
            className={styles.item}
          >
            <div className={styles.iconWrapper}>
              <Grid2x2 size={20} />
            </div>

            <span className={styles.name}>
              All
            </span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className={styles.item}
            >
              <div className={styles.iconWrapper}>
                {getIcon(category.name)}
              </div>

              <span className={styles.name}>
                {category.name}
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}