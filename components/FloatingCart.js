'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './FloatingCart.module.css';

export default function FloatingCart() {
  const { totalItems, isLoaded } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isLoaded && totalItems > 0) {
      setIsVisible(true);
      setAnimated(true);
      
      const timer = setTimeout(() => {
        setAnimated(false);
      }, 300); // Remove animation class after pop
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [totalItems, isLoaded]);

  if (!isLoaded || !isVisible) return null;

  return (
    <Link href="/cart" className={`${styles.floatingCart} ${animated ? styles.pop : ''}`}>
      <div className={styles.iconContainer}>
        <span className={styles.badge}>{totalItems}</span>
        <svg 
           xmlns="http://www.w3.org/2000/svg" 
           viewBox="0 0 24 24" 
           fill="none" 
           stroke="currentColor" 
           strokeWidth="2" 
           strokeLinecap="round" 
           strokeLinejoin="round" 
           className={styles.icon}
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
    </Link>
  );
}
