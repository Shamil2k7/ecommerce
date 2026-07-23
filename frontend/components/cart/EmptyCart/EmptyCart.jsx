"use client";

import React from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import emptyCartAnimation from "../../../public/animations/emptyCart.json"; 
import styles from "./EmptyCart.module.css";

const EmptyCart = () => {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.iconWrapper}>
        <Lottie
          animationData={emptyCartAnimation}
          loop={true}
          className={styles.lottie}
        />
      </div>

      <h2 className={styles.emptyCartTitle}>
        Your Cart is Empty
      </h2>

      <p className={styles.emptyCartSub}>
        Looks like you haven't added anything to your
        <br />
        cart yet.
      </p>

      <Link
        href="/products"
        className={styles.continueShoppingBtn}
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;