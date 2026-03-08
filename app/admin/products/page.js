'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from '../admin.module.css';

export default function ManageProducts() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const { showToast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        showToast('Product deleted successfully', 'success');
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    } finally {
      setDeleting(null);
    }
  };

  if (key !== 'mysecretadmin123') {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorTitle}>Access Denied</div>
        <p>You do not have permission to view this page.</p>
        <Link href="/" style={{ color: 'var(--primary)', marginTop: '16px', fontWeight: '600' }}>
          &larr; Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href={`/admin?key=${key}`} style={{ color: 'var(--text-muted)', marginBottom: '8px', display: 'inline-block' }}>
            &larr; Back to Dashboard
          </Link>
          <h1 className={styles.title}>Manage Products</h1>
        </div>
        <div className={styles.actions}>
          <Link href={`/admin/products/new?key=${key}`} className={styles.btnPrimary}>
            + Add New Product
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No products found. Add some or run the seed script.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <span style={{ fontWeight: '600' }}>{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '4px 12px', 
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>₹{product.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ 
                        color: product.stock < 5 ? 'var(--error)' : 'var(--success)',
                        fontWeight: product.stock < 5 ? '700' : '500'
                      }}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={{ 
                            padding: '6px 12px', 
                            background: 'var(--bg-secondary)', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={() => showToast('Edit feature coming soon', 'info')}
                        >
                          Edit
                        </button>
                        <button 
                          style={{ 
                            padding: '6px 12px', 
                            background: 'rgba(198, 40, 40, 0.1)', 
                            color: 'var(--error)',
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: deleting === product._id ? 'not-allowed' : 'pointer',
                            opacity: deleting === product._id ? 0.5 : 1
                          }}
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deleting === product._id}
                        >
                          {deleting === product._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
