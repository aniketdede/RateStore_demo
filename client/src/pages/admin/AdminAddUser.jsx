import React, { useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function AdminAddUser() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError('');
    try {
      const res = await fetch('http://localhost:4000/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setOk(true); setForm({ name: '', email: '', address: '', password: '', role: 'USER' });
    } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1 style={{ fontSize: 24 }}>
        Add User <span style={{ color: 'var(--text-meta)', fontSize: 14, fontWeight: 400 }}>— role selector included</span>
      </h1>
      <form onSubmit={handle} aria-label="Admin add user" style={{ background: '#fff', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', maxWidth: 560 }}>
        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>{error}</div>}
        {ok && <div role="status" style={{ background: '#e8f6f1', color: '#2e7d67', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>User created successfully.</div>}

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Name (20–60 chars)</label>
        <input required minLength={20} maxLength={60} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Email</label>
        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Address (max 400)</label>
        <input required maxLength={400} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Password (8–16, uppercase + special)</label>
        <input type="password" required minLength={8} maxLength={16} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14 }} />

        <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-meta)' }}>Role</label>
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', marginBottom: 'var(--space-4)', fontSize: 14, background: '#fff' }}>
          <option value="USER">Normal User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Store Owner</option>
        </select>

        <button type="submit" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>Add User</button>
      </form>
    </div>
  );
}
