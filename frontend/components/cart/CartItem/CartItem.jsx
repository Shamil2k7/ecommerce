import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className={styles.cartItem}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <div className={styles.itemHeader}>
          <div>
            <h3 className={styles.itemName}>{item.name}</h3>
            {(item.color || item.size) && (
              <div className={styles.itemVariant}>
                {item.color && <span>Color: {item.color} </span>}
                {item.size && <span>Size: {item.size}</span>}
              </div>
            )}
          </div>
          <div>
            <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className={styles.itemOriginalPrice}>${item.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        <div className={styles.itemControls}>
          <div className={styles.quantityControl}>
            <button 
              className={styles.qtyBtn} 
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className={styles.qtyValue}>{item.quantity}</span>
            <button 
              className={styles.qtyBtn}
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>
          
          <button 
            className={styles.removeBtn} 
            onClick={() => removeItem(item.productId, item.color, item.size)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
