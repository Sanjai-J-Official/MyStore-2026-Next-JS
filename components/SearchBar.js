'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category) params.set('category', category);
    
    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className={styles.input}
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={handleClear} className={styles.clearButton} aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </form>
    </div>
  );
}
