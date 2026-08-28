import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats);
    fetch('http://localhost:4000/api/users?limit=10', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setUsers(d.data || []));
    fetch('http://localhost:4000/api/stores?limit=10', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setStores(d.data || []));
  }, [token]);

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 28, marginBottom: 'var(--space-3)' }}>Admin Dashboard</h1>
      <section aria-label="Stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[{ label: 'Total Users', value: stats.totalUsers }, { label: 'Total Stores', value: stats.totalStores }, { label: 'Total Ratings', value: stats.totalRatings }].map(s => (
          <article key={s.label} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
            <small style={{ color: 'var(--text-meta)' }}>{s.label}</small>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</div>
          </article>
        ))}
      </section>
      <section aria-label="Users table" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Users">
          <thead><tr style={{ borderBottom: '2px solid var(--border-default)' }}><th style={{ textAlign: 'left', padding: '10px' }}>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map(u => <tr key={u.id} style={{ borderBottom: '1px solid var(--border-default)' }}><td style={{ padding: '10px', fontWeight: 500 }}>{u.name}</td><td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{u.email}</td><td style={{ padding: '10px' }}>{u.role}</td></tr>)}
          </tbody>
        </table>
      </section>
      <section aria-label="Stores table" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Stores</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Stores">
          <thead><tr style={{ borderBottom: '2px solid var(--border-default)' }}><th style={{ textAlign: 'left', padding: '10px' }}>Name</th><th>Email</th><th>Avg Rating</th></tr></thead>
          <tbody>
            {stores.map(s => <tr key={s.id} style={{ borderBottom: '1px solid var(--border-default)' }}><td style={{ padding: '10px', fontWeight: 500 }}>{s.name}</td><td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{s.email}</td><td style={{ padding: '10px', fontWeight: 600, color: 'var(--accent-teal)' }}>{s.averageRating?.toFixed(1) || '—'}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
