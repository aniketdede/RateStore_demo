import React, { useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function AdminAddStore() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, ownerId: form.ownerId || null };
      const res = await fetch('http://localhost:4000/api/admin/stores', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setOk(true); setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 24 }}>Add Store <span style={{ color: 'var(--text-meta)', fontSize: 14, fontWeight: 400 }}>— owner optional (nullable FK)</span></h1>
      <form onSubmit={handle} aria-label="Admin add store" style={{ background: '#fff', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', maxWidth: 560 }}>
        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>{error}</div>}
        {ok && <div role="status" style={{ background: '#e8f6f1', color: '#2e7d67', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>Store created.</div>}

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Store Name (20–60 chars)</label>
        <input required minLength={20} maxLength={60} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Store Email</label>
        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Address (max 400)</label>
        <input required maxLength={400} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Owner User ID (optional — blank = unassigned)</label>
        <input value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} placeholder="Leave blank if none" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <button type="submit" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>Add Store</button>
      </form>
    </div>
  );
}
