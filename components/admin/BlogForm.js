'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR 'document is not defined' error
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'], // remove formatting button
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'link',
];

export default function BlogForm({ initialData = null }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    featuredImage: '',
    introduction: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    visibility: 'published',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        featuredImage: initialData.featuredImage || '',
        introduction: initialData.introduction || '',
        content: initialData.content || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        visibility: initialData.visibility || 'published',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = initialData ? `/api/blogs/${initialData._id}` : '/api/blogs';
    const method = initialData ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.group}>
        <label style={styles.label}>Blog Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="e.g. 5 Reasons to Choose Handcrafted Wood"
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Featured Image URL</label>
        <input
          type="text"
          name="featuredImage"
          value={formData.featuredImage}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="https://..."
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Visibility</label>
        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Short Introduction</label>
        <textarea
          name="introduction"
          value={formData.introduction}
          onChange={handleChange}
          required
          rows="3"
          style={{ ...styles.input, resize: 'vertical' }}
          placeholder="A catchy intro that appears on the list page..."
        />
      </div>

      <div style={{ ...styles.group, gridColumn: '1 / -1' }}>
        <label style={styles.label}>Main Content (with Backlink Support)</label>
        <div style={{ background: '#fff', color: '#000', borderRadius: '4px' }}>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleQuillChange}
            modules={quillModules}
            formats={quillFormats}
            style={{ height: '400px', marginBottom: '40px' }}
          />
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>SEO Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Target under 80 characters"
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>SEO Meta Description</label>
        <textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          required
          rows="3"
          style={{ ...styles.input, resize: 'vertical' }}
          placeholder="Target under 160 characters"
        />
      </div>

      <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Saving...' : initialData ? 'Update Blog' : 'Publish Blog'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    background: 'var(--surface)',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    gridColumn: '1 / -1',
    background: 'rgba(255, 82, 82, 0.1)',
    color: '#ff5252',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #ff5252',
  },
};
