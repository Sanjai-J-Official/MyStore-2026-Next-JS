'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from '../../../../checkout/checkout.module.css'; // Reusing form styles
import adminStyles from '../../../admin.module.css';

// --- Inner component wrapped by Suspense ---
function EditProductContent({ params }) {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categories: [],
    stock: '',
    image: ''
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch categories first
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAvailableCategories(data.data);
        // Then fetch product
        return fetchProduct();
      })
      .catch(err => {
        console.error(err);
        showToast('Error loading page data', 'error');
        setIsLoading(false);
      });
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      if (data.success && data.data.product) {
        const p = data.data.product;
        // Migration safety: convert older 'category' string to 'categories' array if needed
        let initialCategories = p.categories || [];
        if (initialCategories.length === 0 && p.category) {
          initialCategories = [p.category];
        }

        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          originalPrice: p.originalPrice || '',
          categories: initialCategories,
          stock: p.stock || '',
          image: p.image || '',
          visibility: p.visibility || 'published'
        });
      } else {
        showToast('Failed to load product details', 'error');
        router.push(`/admin/products`);
      }
    } catch (err) {
      showToast('Error fetching product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (catName) => {
    setFormData(prev => {
      const current = [...prev.categories];
      if (current.includes(catName)) {
        return { ...prev, categories: current.filter(c => c !== catName) };
      } else {
        current.push(catName);
        return { ...prev, categories: current };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      showToast('Please select at least one category', 'error');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock)
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showToast('Product updated successfully!', 'success');
        router.push(`/admin/products`);
      } else {
        showToast(data.error || 'Failed to update product', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '80px 0' }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '32px' }}>
        <Link href={`/admin/products`} style={{ color: 'var(--text-muted)', marginBottom: '8px', display: 'inline-block' }}>
          &larr; Back to Products
        </Link>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Edit Product</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.section}>
          <form id="edit-product-form" onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Product Name *</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange}
                className={styles.input} required placeholder="Premium Wooden Bowl"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Description (HTML supported) *</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                className={styles.input} required rows={4}
                placeholder="<p>Awesome product...</p><a href='/'>Link</a>"
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

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Categories *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableCategories.length > 0 ? availableCategories.map((cat) => (
                  <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.categories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                    />
                    {cat.name}
                  </label>
                )) : <span style={{color: 'var(--text-muted)'}}>No categories configured.</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Quantity *</label>
              <input 
                type="number" name="stock" value={formData.stock} onChange={handleChange}
                className={styles.input} required min="0" placeholder="10"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Visibility</label>
              <select
                name="visibility"
                value={formData.visibility || 'published'}
                onChange={handleChange}
                className={styles.input}
                style={{ padding: '14px', borderRadius: '8px' }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
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
            form="edit-product-form"
            className={styles.payBtn}
            disabled={isSubmitting}
            style={{ marginTop: '24px' }}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProduct({ params }) {
  return (
    <Suspense fallback={<div style={{ padding: '80px 0', textAlign: 'center' }}>Loading...</div>}>
      <EditProductContent params={params} />
    </Suspense>
  );
}
