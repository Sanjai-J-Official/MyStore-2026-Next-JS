import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.logo}>
            My<span>Store</span>
          </Link>
          <p className={styles.tagline}>
            Fresh styles and real prices, delivered directly to your door.
          </p>
        </div>

        <div>
          <h4 className={styles.heading}>Quick Links</h4>
          <ul className={styles.links}>
            <li className={styles.linkItem}><Link href="/">Home</Link></li>
            <li className={styles.linkItem}><Link href="/products">Shop All</Link></li>
            <li className={styles.linkItem}><Link href="/cart">Cart</Link></li>
            <li className={styles.linkItem}><Link href="/admin">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.heading}>Customer Service</h4>
          <ul className={styles.links}>
            <li className={styles.linkItem}><Link href="#">Track Order</Link></li>
            <li className={styles.linkItem}><Link href="#">Returns Policy</Link></li>
            <li className={styles.linkItem}><Link href="#">FAQ</Link></li>
            <li className={styles.linkItem}><Link href="#">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.heading}>Contact Info</h4>
          <div className={styles.contactInfo}>
            <p>123 Commerce St, New City, IN 400001</p>
            <p>Email: support@mystore.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
      </div>
    </footer>
  );
}
