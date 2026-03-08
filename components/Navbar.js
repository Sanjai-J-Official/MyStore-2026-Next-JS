'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    if (totalItems > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          My<span>Store</span>
        </Link>
        
        <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
          <Link 
            href="/" 
            className={`${styles.link} ${pathname === '/' ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`${styles.link} ${pathname === '/products' ? styles.activeLink : ''}`}
            onClick={closeMenu}
          >
            Products
          </Link>
        </div>

        <div className={styles.cartWrapper}>
          <Link href="/cart" className={styles.cartButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && (
              <span className={`${styles.cartCount} ${bounce ? styles.bounce : ''}`}>
                {totalItems}
              </span>
            )}
          </Link>

          <button 
            className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
