'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from '../../checkout/checkout.module.css';
import adminStyles from '../admin.module.css';

function CategoryManagerContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Category added successfully!', 'success');
        setNewCatName('');
        fetchCategories();
      } else {
        showToast(data.error || 'Failed to add category', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Category deleted successfully!', 'success');
        fetchCategories();
      } else {
        showToast(data.error || 'Failed to delete category', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '32px' }}>
        <Link
          href={`/admin`}
          style={{ color: 'var(--text-muted)', marginBottom: '8px', display: 'inline-block' }}
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>
          Manage Categories
        </h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add New Category</h2>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Wooden Decor"
              className={styles.input}
              style={{ flex: 1, margin: 0 }}
            />
            <button type="submit" className={styles.payBtn} style={{ width: 'auto', padding: '0 24px', whiteSpace: 'nowrap' }}>
              Add Category
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Existing Categories</h2>
          {isLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No categories found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => (
                <div key={cat._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    style={{
                      background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '4px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManageCategories() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <CategoryManagerContent />
    </Suspense>
  );
}
