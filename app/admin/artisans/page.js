'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './artisans.module.css';
import { ALL_STATES } from '@/data/india-map';

const EMPTY_FORM = {
  name: '', stateId: '', stateLabel: '', product: '', craft: '',
  region: '', price: '', image: '', description: '', since: '', featured: false,
};

export default function AdminArtisans() {
  const [artisans,      setArtisans]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filterState,   setFilterState]   = useState('');
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [editingId,     setEditingId]     = useState(null);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* Fetch artisans */
  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterState ? `/api/artisans?state=${filterState}` : '/api/artisans';
      const res  = await fetch(url);
      const json = await res.json();
      if (json.success) setArtisans(json.data);
    } catch { showToast('Failed to load artisans', 'error'); }
    finally { setLoading(false); }
  }, [filterState]);

  useEffect(() => { fetchArtisans(); }, [fetchArtisans]);

  /* Handle state dropdown in form — auto-fill stateLabel */
  const handleStateChange = (id) => {
    const found = ALL_STATES.find(s => s.id === id);
    setForm(f => ({ ...f, stateId: id, stateLabel: found ? found.label : '' }));
  };

  /* Submit add / edit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, price: parseFloat(form.price) || 0 };
      const url    = editingId ? `/api/artisans/${editingId}` : '/api/artisans';
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast(editingId ? 'Artisan updated!' : 'Artisan added!');
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchArtisans();
    } catch (err) {
      showToast(err.message || 'Error saving artisan', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* Start edit */
  const startEdit = (artisan) => {
    setForm({
      name:        artisan.name,
      stateId:     artisan.stateId,
      stateLabel:  artisan.stateLabel,
      product:     artisan.product,
      craft:       artisan.craft,
      region:      artisan.region || '',
      price:       String(artisan.price),
      image:       artisan.image || '',
      description: artisan.description || '',
      since:       artisan.since || '',
      featured:    artisan.featured || false,
    });
    setEditingId(artisan._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Confirm then delete */
  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`/api/artisans/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Artisan deleted');
      setDeleteConfirm(null);
      fetchArtisans();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  /* Cancel form */
  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const visibleArtisans = artisans;

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin" className={styles.backLink}>← Admin Dashboard</Link>
          <h1 className={styles.pageTitle}>Artisan Management</h1>
          <p className={styles.pageSubtitle}>{artisans.length} artisan{artisans.length !== 1 ? 's' : ''} in database</p>
        </div>
        <button className={styles.addBtn} onClick={() => { cancelForm(); setShowForm(true); }}>
          + Add Artisan
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editingId ? 'Edit Artisan' : 'Add New Artisan'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Name */}
              <div className={styles.field}>
                <label className={styles.label}>Artisan Name *</label>
                <input className={styles.input} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Ramesh Suthar" required />
              </div>
              {/* State */}
              <div className={styles.field}>
                <label className={styles.label}>State / UT *</label>
                <select className={styles.select} value={form.stateId}
                  onChange={e => handleStateChange(e.target.value)} required>
                  <option value="">Select a state…</option>
                  {ALL_STATES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              {/* Product */}
              <div className={styles.field}>
                <label className={styles.label}>Signature Product *</label>
                <input className={styles.input} value={form.product}
                  onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                  placeholder="e.g. Blue Pottery Vase" required />
              </div>
              {/* Craft */}
              <div className={styles.field}>
                <label className={styles.label}>Craft Type *</label>
                <input className={styles.input} value={form.craft}
                  onChange={e => setForm(f => ({ ...f, craft: e.target.value }))}
                  placeholder="e.g. Blue Pottery" required />
              </div>
              {/* Region */}
              <div className={styles.field}>
                <label className={styles.label}>Region / Town</label>
                <input className={styles.input} value={form.region}
                  onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                  placeholder="e.g. Jaipur, Rajasthan" />
              </div>
              {/* Price */}
              <div className={styles.field}>
                <label className={styles.label}>Price (₹) *</label>
                <input className={styles.input} type="number" min="0" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 2499" required />
              </div>
              {/* Since */}
              <div className={styles.field}>
                <label className={styles.label}>Practising Since</label>
                <input className={styles.input} value={form.since}
                  onChange={e => setForm(f => ({ ...f, since: e.target.value }))}
                  placeholder="e.g. 1952" />
              </div>
              {/* Image */}
              <div className={styles.field}>
                <label className={styles.label}>Image URL</label>
                <input className={styles.input} value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="/icons/cat-artisan-collection.png" />
              </div>
            </div>
            {/* Description */}
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} placeholder="Short artisan story..." />
            </div>
            {/* Featured */}
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              Featured artisan (shown first on map hover)
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update Artisan' : 'Add Artisan'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className={styles.filterRow}>
        <label className={styles.filterLabel}>Filter by State:</label>
        <select className={styles.filterSelect} value={filterState}
          onChange={e => setFilterState(e.target.value)}>
          <option value="">All States</option>
          {ALL_STATES.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        {filterState && (
          <button className={styles.clearFilter} onClick={() => setFilterState('')}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Artisan Table */}
      {loading ? (
        <div className={styles.loadingMsg}>Loading artisans…</div>
      ) : visibleArtisans.length === 0 ? (
        <div className={styles.emptyMsg}>
          No artisans found.{' '}
          <button onClick={() => setShowForm(true)} className={styles.linkBtn}>
            Add one now.
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>State</th>
                <th>Product</th>
                <th>Craft</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleArtisans.map(a => (
                <tr key={a._id}>
                  <td>
                    <img src={a.image || '/icons/cat-artisan-collection.png'} alt={a.name}
                      className={styles.tableImg} />
                  </td>
                  <td className={styles.nameCell}>{a.name}</td>
                  <td>{a.stateLabel}</td>
                  <td>{a.product}</td>
                  <td className={styles.craftCell}>{a.craft}</td>
                  <td>₹{a.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={a.featured ? styles.badgeFeatured : styles.badgePlain}>
                      {a.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => startEdit(a)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(a._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Artisan?</h3>
            <p className={styles.modalBody}>This action cannot be undone. The artisan will be permanently removed.</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmDeleteBtn} onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
