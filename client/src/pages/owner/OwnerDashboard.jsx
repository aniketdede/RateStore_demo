import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function OwnerDashboard() {
  const { user, token } = useAuth();
  const [avg, setAvg] = useState(null);
  const [raters, setRaters] = useState([]);
  const [storeId, setStoreId] = useState('c6f49057-0624-4eb3-a3dd-67ddd7535b82'); // demo store; real app uses user's owned store

  useEffect(() => {
    if (!token || !storeId) return;
    fetch(`http://localhost:4000/api/ratings/${storeId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setAvg(d.averageRating); setRaters(d.ratings || []); });
  }, [token, storeId]);

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 24, marginBottom: 'var(--space-3)' }}>Store Owner Dashboard</h1>
      <section aria-label="Average rating" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '-0.05em' }}>{avg?.toFixed(2) ?? '--'}</div>
        <div><small style={{ color: 'var(--text-meta)' }}>Average Rating</small><br/><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Out of 5</span></div>
      </section>
      <section aria-label="Users who rated" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Users Who Rated</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }} aria-label="Raters table">
            <thead><tr style={{ borderBottom: '2px solid var(--border-default)' }}><th style={{ textAlign: 'left', padding: '12px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Name</th><th>Email</th><th>Rating</th><th>Date</th></tr></thead>
            <tbody>
              {raters.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '12px' }}>{r.user?.name || '—'}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 13 }}>{r.user?.email || '—'}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-teal)' }}>{r.value}</td>
                  <td style={{ padding: '12px', color: 'var(--text-meta)', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
