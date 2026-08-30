import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import StarRating from '../../components/Stars/StarRating';

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [raters, setRaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { store: myStore } = await api.get('/api/stores/my');
        if (!alive) return;
        if (!myStore) { setError('No store is currently assigned to your account. Please contact an administrator.'); setLoading(false); return; }
        setStore(myStore);
        const d = await api.get(`/api/ratings/${myStore.id}`);
        if (!alive) return;
        setAvg(d.averageRating);
        setCount(d.count || 0);
        setRaters(d.ratings || []);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const th = { textAlign: 'left', padding: '12px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' };
  const td = { padding: '12px' };

  if (loading) return <p style={{ color: 'var(--text-meta)' }}>Loading your store…</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 'var(--space-3)' }}>Store Owner Dashboard</h1>
      {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>{error}</div>}

      {store && (
        <>
          <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{store.name}</strong> — {store.email}
          </p>

          <section aria-label="Average rating" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '-0.05em' }}>{avg ? Number(avg).toFixed(2) : '--'}</div>
            <div>
              <StarRating value={Math.round(avg || 0)} />
              <div style={{ marginTop: 4 }}><small style={{ color: 'var(--text-meta)' }}>Average rating · {count} rating{count === 1 ? '' : 's'}</small></div>
            </div>
          </section>

          <section aria-label="Users who rated" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Users Who Rated</h2>
            {raters.length === 0 ? (
              <p style={{ color: 'var(--text-meta)' }}>No ratings yet for your store.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }} aria-label="Raters table">
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                      <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Rating</th><th style={th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raters.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <td style={{ ...td, fontWeight: 500 }}>{r.user?.name || '—'}</td>
                        <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{r.user?.email || '—'}</td>
                        <td style={{ ...td, fontWeight: 700, color: 'var(--accent-teal)' }}><StarRating value={r.value} /> <span style={{ marginLeft: 6 }}>{r.value}</span></td>
                        <td style={{ ...td, color: 'var(--text-meta)', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
