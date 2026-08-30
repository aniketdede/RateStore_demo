import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import StarRating from '../Stars/StarRating';

export default function RatingModal({ store, onClose, onRated }) {
  const [value, setValue] = useState(0);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get(`/api/ratings/${store.id}/my`)
      .then(d => { if (alive) { setExisting(d.rating); setValue(d.rating?.value || 0); } })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [store.id]);

  const submit = async () => {
    if (!value) { setError('Please pick a rating from 1 to 5 stars.'); return; }
    setSaving(true); setError('');
    try {
      await api.post(`/api/ratings/${store.id}`, { value });
      setDone(true);
      if (onRated) onRated(value);
      setTimeout(onClose, 700);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-label={`Rate ${store.name}`}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,35,50,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', zIndex: 50 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-card-hover)' }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>Rate this store</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>{store.name}</p>

        {loading ? (
          <p style={{ color: 'var(--text-meta)' }}>Loading your rating…</p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              {existing ? `Your current rating: ${existing.value}/5. Choose a new value to modify it.` : 'Select your rating (you can change it later):'}
            </p>
            <div style={{ padding: 'var(--space-3) 0', textAlign: 'center' }}>
              <StarRating value={value} onChange={setValue} />
              <div style={{ marginTop: 'var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {value ? `${value} / 5` : '—'}
              </div>
            </div>

            {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 13 }}>{error}</div>}
            {done && <div role="status" style={{ background: '#e8f6f1', color: '#2e7d67', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 13 }}>Rating saved. Thank you!</div>}

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={submit} disabled={saving || done} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: saving || done ? 0.7 : 1 }}>
                {saving ? 'Saving…' : existing ? 'Update rating' : 'Submit rating'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
