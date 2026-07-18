import React from 'react';
import Link from 'next/link';
import styles from './EmptyCart.module.css';

const EmptyCart = () => {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.emptyCartTitle}>Your Cart is Empty</div>
      <div className={styles.emptyCartSub}>Looks like you haven't added anything to your cart yet.</div>
      <Link href="/products" className={styles.continueShoppingBtn}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
