import React, { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    // Populate the owner picker with existing OWNER accounts.
    api.get('/api/users?role=OWNER&limit=50')
      .then(d => setOwners(d.data || []))
      .catch(() => setOwners([]));
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setOk(false);
    try {
      const payload = { ...form, ownerId: form.ownerId || null };
      await api.post('/api/admin/stores', payload);
      setOk(true);
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const label = { display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' };
  const input = { width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 };

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 24 }}>Add Store <span style={{ color: 'var(--text-meta)', fontSize: 14, fontWeight: 400 }}>— owner optional (nullable FK)</span></h1>
      <form onSubmit={handle} aria-label="Admin add store" style={{ background: '#fff', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', maxWidth: 560 }}>
        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>{error}</div>}
        {ok && <div role="status" style={{ background: '#e8f6f1', color: '#2e7d67', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>Store created.</div>}

        <label style={label} htmlFor="store-name">Store Name (20–60 chars)</label>
        <input id="store-name" required minLength={20} maxLength={60} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={input} />

        <label style={label} htmlFor="store-email">Store Email</label>
        <input id="store-email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={input} />

        <label style={label} htmlFor="store-addr">Address (max 400)</label>
        <input id="store-addr" required maxLength={400} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={input} />

        <label style={label} htmlFor="store-owner">Owner (optional — blank = unassigned)</label>
        <select id="store-owner" value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} style={{ ...input, background: '#fff' }}>
          <option value="">— No owner (unassigned) —</option>
          {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
        </select>
        {owners.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-meta)', marginTop: -12, marginBottom: 'var(--space-4)' }}>No OWNER accounts yet. Create one under “Add User” first.</p>}

        <button type="submit" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>Add Store</button>
      </form>
    </div>
  );
}
