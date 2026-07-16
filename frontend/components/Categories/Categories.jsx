import Link from "next/link";
import styles from "./Categories.module.css";

const categories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
  },
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
  },
  {
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
  },
];

export default function Categories() {
  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Shop By Category</h2>
          <Link href="/categories">View All →</Link>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <Link
              href="/products"
              key={index}
              className={styles.card}
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className={styles.overlay}></div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}