'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartItem.module.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(item.productId);
    }, 300); // Wait for animation to finish
  };

  const handleQtyChange = (type) => {
    if (type === 'inc' && item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1);
    } else if (type === 'dec' && item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <div className={`${styles.item} ${isRemoving ? styles.removing : ''}`}>
      <Link href={`/products/${item.productId}`} className={styles.imageContainer}>
        <img src={item.image} alt={item.name} className={styles.image} />
      </Link>
      
      <div className={styles.details}>
        <div className={styles.category}>{item.category}</div>
        <Link href={`/products/${item.productId}`}>
          <h3 className={styles.name} title={item.name}>{item.name}</h3>
        </Link>
        <div className={styles.price}>₹{item.price.toLocaleString('en-IN')}</div>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.qtyWrapper}>
          <button 
            className={styles.qtyBtn}
            onClick={() => handleQtyChange('dec')}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className={styles.qtyValue}>{item.quantity}</span>
          <button 
            className={styles.qtyBtn}
            onClick={() => handleQtyChange('inc')}
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <div className={styles.total}>
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </div>
        
        <button 
          className={styles.removeBtn} 
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
