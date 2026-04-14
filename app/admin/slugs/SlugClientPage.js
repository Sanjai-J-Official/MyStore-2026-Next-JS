'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

export default function SlugClientPage({ initialData }) {
  const [items, setItems] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [editSlug, setEditSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEdit = (id, currentSlug) => {
    setEditingId(id);
    setEditSlug(currentSlug);
    setErrorMsg('');
  };

  const handleSave = async (id, type) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/slugs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, slug: editSlug })
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state smoothly
      setItems(items.map(item => {
        if (item.id === id) {
          const prefix = item.type === 'Product' ? '/products/' : '/blog/';
          return { ...item, slug: data.newSlug, path: prefix + data.newSlug };
        }
        return item;
      }));
      setEditingId(null);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage URLs (Slugs)</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Change the underlying SEO URL for your products and blogs. Be careful, changing URLs might break external links if not redirected.
      </p>

      {errorMsg && (
        <div style={{ background: 'rgba(255, 82, 82, 0.1)', color: '#ff5252', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name / Title</th>
              <th>Current URL Path</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`${styles.statusBadge} ${item.type === 'Blog' ? styles.status_paid : styles.status_processing}`}>
                    {item.type}
                  </span>
                </td>
                <td style={{ fontWeight: '500' }}>{item.title}</td>
                <td>
                  {editingId === item.id ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {item.type === 'Product' ? '/products/' : '/blog/'}
                      </span>
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        style={{ padding: '8px', border: '1px solid var(--primary)', borderRadius: '4px', marginLeft: '4px', outline: 'none' }}
                      />
                    </div>
                  ) : (
                    <a href={item.path} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      {item.path}
                    </a>
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleSave(item.id, item.type)}
                        disabled={loading}
                        className={styles.statusBadge}
                        style={{ background: 'var(--success)', color: 'black', border: 'none', cursor: 'pointer' }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className={styles.statusBadge}
                        style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEdit(item.id, item.slug)}
                      className={styles.statusBadge}
                      style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
                    >
                      Edit URL
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
