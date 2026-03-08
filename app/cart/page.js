'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import styles from './cart.module.css';

export default function CartPage() {
  const { cartItems, totalPrice, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyDesc}>Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products" className={styles.startShoppingBtn}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = 499;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const gst = totalPrice * 0.18;
  const finalTotal = totalPrice + shipping + gst;
  const progressPercent = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>
      
      <div className={styles.cartLayout}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.freeShippingBar}>
              {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                <div className={`${styles.freeShippingText} ${styles.successText}`}>
                  You&apos;ve unlocked FREE shipping! 🎉
                </div>
              ) : (
                <div className={styles.freeShippingText}>
                  Add ₹{(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString('en-IN')} more for FREE shipping
                </div>
              )}
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className={styles.successText}>FREE</span> : `₹${shipping}`}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
            </div>
            
            <Link href="/checkout" className={styles.checkoutBtn} style={{ textDecoration: 'none' }}>
              Proceed to Checkout
            </Link>
            
            <Link href="/products" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
