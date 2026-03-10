import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';


async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({}).limit(4).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const categories = [
    { name: 'Clothing', icon: '👕', href: '/products?category=Clothing' },
    { name: 'Footwear', icon: '👟', href: '/products?category=Footwear' },
    { name: 'Electronics', icon: '📱', href: '/products?category=Electronics' },
    { name: 'Accessories', icon: '🕶️', href: '/products?category=Accessories' },
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.floatingShapes}>
          <div className={`${styles.shape} ${styles.shape1}`}></div>
          <div className={`${styles.shape} ${styles.shape2}`}></div>
          <div className={`${styles.shape} ${styles.shape3}`}></div>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Fresh Styles, Real Prices</h1>
          <p className={styles.heroSubtitle}>
            Discover the latest trends across fashion, electronics, and accessories. 
            Premium quality items delivered right to your doorstep.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/products" className={styles.btnPrimary}>
              Shop Now
            </Link>
            <Link href="/#categories" className={styles.btnSecondary}>
              View Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE BANNER */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          FREE SHIPPING ABOVE ₹499 &bull; EASY RETURNS &bull; SECURE PAYMENTS &bull; NEW ARRIVALS &bull; 
          FREE SHIPPING ABOVE ₹499 &bull; EASY RETURNS &bull; SECURE PAYMENTS &bull; NEW ARRIVALS &bull;
          FREE SHIPPING ABOVE ₹499 &bull; EASY RETURNS &bull; SECURE PAYMENTS &bull; NEW ARRIVALS
        </div>
      </div>

      {/* 3. FEATURED CATEGORIES SECTION */}
      <section id="categories" className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link href={cat.href} key={cat.name} className={styles.categoryCard}>
              <div className={styles.categoryIcon}>{cat.icon}</div>
              <span className={styles.categoryName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        {featuredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No products available yet. Run the seed script to populate data.
          </p>
        )}
        <div className={styles.viewAllContainer}>
          <Link href="/products" className={styles.viewAllBtn}>
            View All Products
          </Link>
        </div>
      </section>

      {/* 5. FEATURES STRIP */}
      <div className={styles.featuresStrip}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureBox}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <h3 className={styles.featureTitle}>Free Shipping</h3>
            <p className={styles.featureDesc}>On all orders above ₹499 within India.</p>
          </div>
          
          <div className={styles.featureBox}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <h3 className={styles.featureTitle}>Easy Returns</h3>
            <p className={styles.featureDesc}>15-day return policy for all products.</p>
          </div>

          <div className={styles.featureBox}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3 className={styles.featureTitle}>Secure Payment</h3>
            <p className={styles.featureDesc}>100% secure payments via Razorpay.</p>
          </div>

          <div className={styles.featureBox}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <h3 className={styles.featureTitle}>24/7 Support</h3>
            <p className={styles.featureDesc}>Dedicated chat and email support.</p>
          </div>
        </div>
      </div>
    </>
  );
}
