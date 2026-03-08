import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  // Calculate if product is new (created within last 7 days)
  const isNew = product.createdAt 
    ? new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  const savings = product.originalPrice - product.price;

  return (
    <div className={styles.card}>
      <Link href={`/products/${product._id || product.id}`} className={styles.imageContainer}>
        <div className={styles.badges}>
          {discount > 0 && <span className={styles.discountBadge}>{discount}% OFF</span>}
          {isNew && <span className={styles.newBadge}>NEW</span>}
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.image}
          loading="lazy"
        />
      </Link>
      
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <Link href={`/products/${product._id || product.id}`}>
          <h3 className={styles.name} title={product.name}>{product.name}</h3>
        </Link>
        
        <div className={styles.rating}>
          {[...Array(4)].map((_, i) => (
            <svg key={i} className={styles.star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
          <svg className={styles.starEmpty} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(24)</span>
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {savings > 0 && (
            <span className={styles.savings}>Save ₹{savings.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>

      <div className={styles.quickAdd}>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
