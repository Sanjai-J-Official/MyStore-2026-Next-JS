import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import ArtisanMap from '@/components/ArtisanMap';
import styles from './page.module.css';


async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({}).limit(8).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export const metadata = {
  title: 'Hidden Leaf | Premium Handcrafted & Wooden Products',
  description:
    'Discover rare, handmade, and premium wooden products sourced from hidden artisans. Corporate gifting, artisan collections & limited editions.',
};

const categories = [
  {
    name: 'Wooden Decor',
    img: '/icons/cat-wooden-decor.png',
    href: '/products?category=Wooden+Decor',
  },
  {
    name: 'Handcrafted Gifts',
    img: '/icons/cat-handcrafted-gifts.png',
    href: '/products?category=Handcrafted+Gifts',
  },
  {
    name: 'Premium Wooden',
    img: '/icons/cat-premium-wooden.png',
    href: '/products?category=Premium+Wooden',
  },
  {
    name: 'Corporate Gifting',
    img: '/icons/cat-corporate-gifting.png',
    href: '/products?category=Corporate+Gifting',
  },
  {
    name: 'Artisan Collection',
    img: '/icons/cat-artisan-collection.png',
    href: '/products?category=Artisan+Collection',
  },
  {
    name: 'Limited Edition',
    img: '/icons/cat-limited-edition.png',
    href: '/products?category=Limited+Edition',
  },
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. MARQUEE BANNER */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          &nbsp;&nbsp;FREE SHIPPING ABOVE ₹499 &bull; AUTHENTIC HANDCRAFTED &bull; SECURE PAYMENTS &bull;
          CUSTOM GIFTING AVAILABLE &bull; 15-DAY EASY RETURNS &bull;&nbsp;&nbsp;
          FREE SHIPPING ABOVE ₹499 &bull; AUTHENTIC HANDCRAFTED &bull; SECURE PAYMENTS &bull;
          CUSTOM GIFTING AVAILABLE &bull; 15-DAY EASY RETURNS &bull;&nbsp;&nbsp;
        </div>
      </div>

      {/* 3. ARTISAN DISCOVERY MAP */}
      <ArtisanMap />

      {/* 4. CATEGORIES */}
      <div className={styles.categorySection}>
        <div className={styles.categoryInner}>
          <span className={styles.sectionLabel}>Explore</span>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <span className={styles.divider} />
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link href={cat.href} key={cat.name} className={styles.categoryCard}>
                <div className={styles.categoryIconWrap}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className={styles.categoryIconImg}
                  />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BEST SELLING PRODUCTS */}
      <section className={styles.section}>
        <span className={styles.sectionLabel}>Bestsellers</span>
        <h2 className={styles.sectionTitle}>Our Finest Creations</h2>
        <span className={styles.divider} />
        <p className={styles.sectionSubtitle}>
          Handpicked by our artisans — every piece tells a story of craftsmanship, heritage, and heart.
        </p>
        {featuredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            Our collection is coming soon. Check back for exclusive handcrafted pieces.
          </p>
        )}
        <div className={styles.viewAllContainer}>
          <Link href="/products" className={styles.viewAllBtn}>
            View All Products
          </Link>
        </div>
      </section>

      {/* 6. ARTISAN STORY SECTION */}
      <div className={styles.artisanSection}>
        <div className={styles.artisanInner}>
          <div className={styles.artisanText}>
            <span className={styles.sectionLabel}>Our Story</span>
            <h2 className={styles.sectionTitle}>Behind Every Piece,<br />A Hidden Artisan</h2>
            <span className={styles.divider} />
            <p className={styles.artisanBody}>
              Hidden Leaf was born from a simple belief — that the most extraordinary things are made by hands most of us will never hear of. 
              We travel to remote villages, mountain workshops, and coastal communities to bring you pieces that carry the soul of their maker.
            </p>
            <p className={styles.artisanBody}>
              Each product comes with its maker's story — where it was made, who made it, and why it matters.
            </p>
            <div className={styles.artisanStats}>
              <div className={styles.artisanStat}>
                <span className={styles.statNum}>200+</span>
                <span className={styles.statLabel}>Artisan Partners</span>
              </div>
              <div className={styles.artisanStat}>
                <span className={styles.statNum}>18</span>
                <span className={styles.statLabel}>States Covered</span>
              </div>
              <div className={styles.artisanStat}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Handcrafted</span>
              </div>
            </div>
            <Link href="/products" className={styles.btnGold}>
              Explore the Collection
            </Link>
          </div>
          <div className={styles.artisanImageWrap}>
            {/* Show first product image or a placeholder gradient */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3a2518 0%, #6B4226 50%, #8B5E3C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className={styles.artisanImageAccent} />
          </div>
        </div>
      </div>

      {/* 6. CORPORATE GIFTING */}
      <div className={styles.corporateSection}>
        <div className={styles.corporateInner}>
          <span className={styles.sectionLabel}>For Businesses</span>
          <h2 className={styles.sectionTitle}>Elevate Your Corporate Gifting</h2>
          <span className={styles.divider} />
          <p className={styles.sectionSubtitle}>
            Leave a lasting impression with curated wooden and handcrafted gift sets — personalised, branded, and delivered at scale.
          </p>
          <div className={styles.corporateFeatures}>
            <div className={styles.corporateFeature}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              Bulk Orders (50+)
            </div>
            <div className={styles.corporateFeature}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
              7-Day Delivery
            </div>
            <div className={styles.corporateFeature}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Custom Branding
            </div>
            <div className={styles.corporateFeature}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
              Luxury Packaging
            </div>
          </div>
          <Link href="mailto:info@fromthehiddenleafstore.com?subject=Corporate Gifting Inquiry" className={styles.btnGold}>
            Request a Quote
          </Link>
          <Link href="/products?category=Corporate+Gifting" className={styles.btnOutlineWood}>
            Browse Gift Sets
          </Link>
        </div>
      </div>

      {/* 7. LIMITED EDITION SHOWCASE */}
      <div className={styles.limitedSection}>
        <div className={styles.limitedInner}>
          <div>
            <div className={styles.limitedBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Limited Edition
            </div>
            <h2 className={styles.limitedTitle}>Rare Finds, Made Once.</h2>
            <p className={styles.limitedDesc}>
              Our Limited Edition collection features one-of-a-kind pieces created by master craftsmen in small batches. 
              Once they're gone, they're gone — own a piece of genuine artisan heritage.
            </p>
            <Link href="/products?category=Limited+Edition" className={styles.viewAllBtn}>
              Shop Limited Edition
            </Link>
          </div>
          <div className={styles.limitedImageGrid}>
            {['/icons/cat-wooden-decor.png', '/icons/cat-artisan-collection.png', '/icons/cat-premium-wooden.png'].map((src, i) => (
              <div key={i} className={styles.limitedImg}>
                <img src={src} alt="Limited edition piece" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. FEATURES STRIP */}
      <div className={styles.featuresStrip}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureBox}>
            <div className={styles.featureIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Free Shipping</h3>
            <p className={styles.featureDesc}>On all orders above ₹499 across India.</p>
          </div>
          <div className={styles.featureBox}>
            <div className={styles.featureIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Easy Returns</h3>
            <p className={styles.featureDesc}>15-day hassle-free return policy.</p>
          </div>
          <div className={styles.featureBox}>
            <div className={styles.featureIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Secure Payment</h3>
            <p className={styles.featureDesc}>100% secure via Razorpay.</p>
          </div>
          <div className={styles.featureBox}>
            <div className={styles.featureIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 11.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.1 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.58 2.81.71A2 2 0 0 1 21 16.92z"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Dedicated Support</h3>
            <p className={styles.featureDesc}>Email us at info@fromthehiddenleafstore.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
