'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { SkeletonGrid } from '@/components/Skeleton';
import SearchBar from '@/components/SearchBar';
import styles from './products.module.css';

const CATEGORIES = ['All', 'Clothing', 'Footwear', 'Electronics', 'Accessories', 'Bags'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/products', window.location.origin);
        if (activeCategory !== 'All') {
          url.searchParams.set('category', activeCategory);
        }
        if (search) {
          url.searchParams.set('search', search);
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, search]);

  const handleClearFilters = () => {
    window.location.href = '/products';
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Products</h1>
        <SearchBar />
        
        {search && (
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Showing results for <strong>&quot;{search}&quot;</strong> ({sortedProducts.length})
          </p>
        )}
        
        <div className={styles.controls}>
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} 
                {activeCategory === cat && activeCategory !== 'All' && <span>{sortedProducts.length}</span>}
              </button>
            ))}
          </div>
          
          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          <SkeletonGrid count={8} />
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className={styles.grid}>
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h2 className={styles.emptyTitle}>No products found</h2>
          <p className={styles.emptyDesc}>We couldn't find anything matching your current filters.</p>
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className={styles.container}><SkeletonGrid count={8} /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
