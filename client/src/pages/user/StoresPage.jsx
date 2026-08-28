import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function StoresPage() {
  const { user, token } = useAuth();
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState('');
  const [ratingMap, setRatingMap] = useState({});

  const fetchStores = async (q = '') => {
    const url = q ? `http://localhost:4000/api/stores?name=${encodeURIComponent(q)}&limit=10` : 'http://localhost:4000/api/stores?limit=10';
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const data = await res.json();
    setStores(data.data || []);
  };

  useEffect(() => { fetchStores(query); }, [query]);

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 24, marginBottom: 'var(--space-3)' }}>Stores</h1>
      <input type="text" placeholder="Search stores by name…" value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', maxWidth: 400, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {stores.map(s => (
          <article key={s.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: 18, marginBottom: 'var(--space-2)' }}>{s.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{s.address}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 'var(--space-3)' }}>{s.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{s.averageRating?.toFixed(1) || '—'}</span>
              <span style={{ fontSize: 12, color: 'var(--text-meta)' }}>avg rating</span>
            </div>
            <a href="#" style={{ display: 'inline-block', marginTop: 'var(--space-3)', color: 'var(--accent-teal)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>Submit / Modify Rating →</a>
          </article>
        ))}
      </div>
    </div>
  );
}
