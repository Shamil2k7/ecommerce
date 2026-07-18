import React from "react";
import Link from "next/link";
import styles from "./EmptyCart.module.css";

const EmptyCart = () => {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.iconWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.cartIcon}
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      </div>

      <h2 className={styles.emptyCartTitle}>Your Cart is Empty</h2>

      <p className={styles.emptyCartSub}>
        Looks like you haven't added anything to your <br /> cart yet.
      </p>

      <Link href="/products" className={styles.continueShoppingBtn}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;