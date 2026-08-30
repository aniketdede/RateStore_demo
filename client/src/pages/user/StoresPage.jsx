import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/client';
import { useAuth } from '../../components/context/AuthContext';
import StarRating from '../../components/Stars/StarRating';
import RatingModal from '../../components/Rating/RatingModal';

export default function StoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState('');
  const [myRatings, setMyRatings] = useState({});
  const [activeStore, setActiveStore] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '12' });
      if (q) params.set('q', q); // server searches name + email + address
      const data = await api.get(`/api/stores?${params.toString()}`);
      setStores(data.data || []);
      // Fetch the current user's existing rating for every store (one per store).
      const entries = await Promise.all(
        (data.data || []).map(async (s) => {
          try {
            const r = await api.get(`/api/ratings/${s.id}/my`);
            return [s.id, r.rating?.value || 0];
          } catch { return [s.id, 0]; }
        })
      );
      setMyRatings(Object.fromEntries(entries));
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStores(query); }, [query, fetchStores, token]);

  const onRated = (val) => {
    if (activeStore) {
      setMyRatings(prev => ({ ...prev, [activeStore.id]: val }));
      setStores(prev => prev.map(s => s.id === activeStore.id ? { ...s, ratingCount: s.ratingCount + (myRatings[s.id] ? 0 : 1) } : s));
    }
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search stores by name, email or address…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search stores"
        style={{ width: '100%', maxWidth: 460, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }}
      />

      {loading && <p style={{ color: 'var(--text-meta)' }}>Loading stores…</p>}
      {!loading && stores.length === 0 && <p>No stores match your search.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {stores.map(s => {
          const my = myRatings[s.id] || 0;
          return (
            <article key={s.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 18, marginBottom: 'var(--space-2)' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{s.address}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 'var(--space-3)' }}>{s.email}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <StarRating value={Math.round(s.averageRating || 0)} />
                <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{Number(s.averageRating || 0).toFixed(1)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-meta)' }}>avg ({s.ratingCount || 0})</span>
              </div>

              <div style={{ fontSize: 13, color: my ? 'var(--text-primary)' : 'var(--text-meta)', marginBottom: 'var(--space-3)', fontWeight: my ? 600 : 400 }}>
                {my ? `Your rating: ${my} / 5` : 'You have not rated this store yet.'}
              </div>

              <button
                onClick={() => setActiveStore(s)}
                style={{ marginTop: 'auto', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                {my ? 'Modify rating' : 'Submit rating'}
              </button>
            </article>
          );
        })}
      </div>

      {activeStore && <RatingModal store={activeStore} onClose={() => setActiveStore(null)} onRated={onRated} />}
    </div>
  );
}
