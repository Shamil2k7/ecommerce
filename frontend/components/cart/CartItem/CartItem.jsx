import React from "react";
import { FiHeart, FiTrash2, FiShoppingBag } from "react-icons/fi";
import styles from "./CartItem.module.css";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const discount =
    item.originalPrice > item.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0;

  return (
    <div className={styles.cartItem}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.itemImage}
        />

        <div className={styles.quantityControl}>
          <button
            className={styles.qtyBtn}
            onClick={() =>
              updateQuantity(
                item.productId,
                item.quantity - 1,
                item.color,
                item.size
              )
            }
            disabled={item.quantity <= 1}
          >
            −
          </button>

          <span className={styles.qtyValue}>{item.quantity}</span>

          <button
            className={styles.qtyBtn}
            onClick={() =>
              updateQuantity(
                item.productId,
                item.quantity + 1,
                item.color,
                item.size
              )
            }
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>

        {(item.color || item.size) && (
          <div className={styles.itemVariant}>
            {item.color && <span>Color: {item.color}</span>}
            {item.size && <span>Size: {item.size}</span>}
          </div>
        )}

        <div className={styles.ratingRow}>
          <span className={styles.ratingBadge}>4.3 ★</span>
          <span className={styles.reviewCount}>(120 Reviews)</span>
        </div>

        <div className={styles.priceRow}>
          {discount > 0 && (
            <span className={styles.offer}>{discount}% Off</span>
          )}

          {item.originalPrice > item.price && (
            <span className={styles.itemOriginalPrice}>
              ₹{item.originalPrice}
            </span>
          )}

          <span className={styles.itemPrice}>₹{item.price}</span>
        </div>

        <div className={styles.upiOffer}>
          ₹{item.price - 50} with UPI Offer
        </div>

        <div className={styles.actionBar}>
          <button className={styles.actionBtn}>
            <FiHeart className={styles.actionIcon} />
            Save for later
          </button>

          <button
            className={`${styles.actionBtn} ${styles.removeBtn}`}
            onClick={() =>
              removeItem(
                item.productId,
                item.color,
                item.size
              )
            }
          >
            <FiTrash2 className={styles.actionIcon} />
            Remove
          </button>

          <button className={styles.actionBtn}>
            <FiShoppingBag className={styles.actionIcon} />
            Buy this now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;