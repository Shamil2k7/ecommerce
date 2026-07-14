import styles from "./TopProducts.module.css";
import ProductCard from "../ProductCard/ProductCard";
import products from "@/data/products";

export default function TopProducts() {
  return (
    <section className={styles.section}>

      <div className={styles.header}>

        <div>
          <h2>Top Products</h2>
          <p>Most Popular Products</p>
        </div>

        <button className={styles.button}>
          View All
        </button>

      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}