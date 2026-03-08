'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './AddToCartButton.module.css';

export default function AddToCartButton({ product, disabled = false, small = false }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      className={`${styles.button} ${isAdded ? styles.success : ''} ${small ? styles.small : ''}`}
      onClick={handleAddToCart}
      disabled={disabled || product.stock === 0}
      aria-label="Add to cart"
    >
      {isAdded ? (
        <>
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {small ? '' : 'Added!'}
        </>
      ) : (
        <>
          <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {small ? '' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
        </>
      )}
    </button>
  );
}
