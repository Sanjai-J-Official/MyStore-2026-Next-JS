import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.logo}>
            Hidden <span>Leaf</span>
          </Link>
          <p className={styles.tagline}>
            Rare, handmade, and premium wooden products from hidden artisans across India.
          </p>
        </div>

        <div>
          <h4 className={styles.heading}>Quick Links</h4>
          <ul className={styles.links}>
            <li className={styles.linkItem}><Link href="/">Home</Link></li>
            <li className={styles.linkItem}><Link href="/products">Shop All</Link></li>
            <li className={styles.linkItem}><Link href="/products?category=Corporate+Gifting">Corporate Gifting</Link></li>
            <li className={styles.linkItem}><Link href="/cart">Cart</Link></li>
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
            <p>India</p>
            <p>Email: info@fromthehiddenleafstore.com</p>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Hidden Leaf Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
