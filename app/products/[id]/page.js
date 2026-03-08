'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard';
import { SkeletonGrid } from '@/components/Skeleton';
import styles from './product.module.css';

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data.product);
          setRelatedProducts(data.data.relatedProducts);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductDetails();
    }
  }, [params.id]);

  const handleQuantityChange = (type) => {
    if (type === 'inc' && product && quantity < product.stock) {
      setQuantity(q => q + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity} ${product.name} added to cart!`, 'success');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <span>Home</span> <span className={styles.separator}>&gt;</span>
          <span>Products</span> <span className={styles.separator}>&gt;</span>
          <span>Loading...</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.imageSection} style={{ background: '#f5f5f5', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ padding: '20px 0' }}>
            <div style={{ height: '40px', background: '#f5f5f5', marginBottom: '20px', borderRadius: '8px' }}></div>
            <div style={{ height: '20px', width: '50%', background: '#f5f5f5', marginBottom: '40px', borderRadius: '4px' }}></div>
            <div style={{ height: '100px', background: '#f5f5f5', marginBottom: '40px', borderRadius: '8px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '20px 0' }}>{error || 'The product you are looking for does not exist.'}</p>
        <Link href="/products" style={{ color: 'var(--primary)', fontWeight: '600' }}>
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const savings = product.originalPrice - product.price;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span className={styles.separator}>&gt;</span>
        <Link href="/products">Products</Link> <span className={styles.separator}>&gt;</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{product.name}</span>
      </div>

      <div className={styles.grid}>
        {/* LEFT SIDE */}
        <div className={styles.imageSection}>
          {discount > 0 && <div className={styles.badge}>{discount}% OFF</div>}
          <img 
            src={product.image} 
            alt={product.name} 
            className={styles.image} 
          />
        </div>

        {/* RIGHT SIDE */}
        <div>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.rating}>
            {[...Array(4)].map((_, i) => (
              <svg key={i} className={styles.star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
            <svg className={styles.star} style={{ color: 'var(--border)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className={styles.reviewCount}>(24 reviews)</span>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.prices}>
              <span className={styles.currentPrice}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            {savings > 0 && (
              <span className={styles.savings}>You save ₹{savings.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className={styles.stockStatus}>
            {product.stock > 0 ? (
              <span className={styles.inStock}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className={styles.outOfStock}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Out of Stock
              </span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <span className={styles.qtyLabel}>Quantity:</span>
              <div className={styles.qtyControls}>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => handleQuantityChange('dec')}
                  disabled={quantity <= 1 || product.stock === 0}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className={styles.qtyInput} 
                />
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => handleQuantityChange('inc')}
                  disabled={quantity >= product.stock || product.stock === 0}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.buyButtons}>
              <button 
                className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`} 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {isAdded ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Free Delivery on orders above ₹499</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <span>15 Days Easy Returns Policy</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>100% Secure Payment using Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD: RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
