'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from '../../../checkout/checkout.module.css'; // Reusing form styles
import adminStyles from '../../admin.module.css';

export default function AddProduct() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = ['Clothing', 'Footwear', 'Electronics', 'Accessories', 'Bags'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock)
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showToast('Product added successfully!', 'success');
        router.push(`/admin/products?key=${key}`);
      } else {
        showToast(data.error || 'Failed to add product', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (key !== 'mysecretadmin123') {
    return (
      <div className={adminStyles.errorState}>
        <div className={adminStyles.errorTitle}>Access Denied</div>
        <p>You do not have permission to view this page.</p>
        <Link href="/" style={{ color: 'var(--primary)', marginTop: '16px', fontWeight: '600' }}>
          &larr; Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '32px' }}>
        <Link href={`/admin/products?key=${key}`} style={{ color: 'var(--text-muted)', marginBottom: '8px', display: 'inline-block' }}>
          &larr; Back to Products
        </Link>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Add New Product</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.section}>
          <form id="add-product-form" onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Product Name *</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange}
                className={styles.input} required placeholder="Classic White T-Shirt"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Description *</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                className={styles.input} required rows={4}
                placeholder="Product description..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Selling Price (₹) *</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange}
                className={styles.input} required min="0" placeholder="499"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Original Price (₹) *</label>
              <input 
                type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                className={styles.input} required min="0" placeholder="799"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                className={styles.input} required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Quantity *</label>
              <input 
                type="number" name="stock" value={formData.stock} onChange={handleChange}
                className={styles.input} required min="0" placeholder="10"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Image URL *</label>
              <input 
                type="url" name="image" value={formData.image} onChange={handleChange}
                className={styles.input} required placeholder="https://images.unsplash.com/..."
              />
            </div>
          </form>
        </div>

        <div className={styles.section} style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
          <h2 className={styles.sectionTitle}>Image Preview</h2>
          <div style={{ 
            width: '100%', 
            aspectRatio: '1', 
            background: 'var(--bg-secondary)', 
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed var(--border)'
          }}>
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No image provided</span>
            )}
          </div>

          <button 
            type="submit" 
            form="add-product-form"
            className={styles.payBtn}
            disabled={isSubmitting}
            style={{ marginTop: '24px' }}
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
