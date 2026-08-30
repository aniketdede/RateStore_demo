import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';
import api from '../../api/client';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/api/auth/register', { name, email, address, password }, { auth: false });
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 'var(--space-4)' }}>
      <form onSubmit={handleSubmit} aria-label="Registration form" style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', width: '100%', maxWidth: 480 }}>
        <h1 style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>Create account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', fontSize: 14 }}>Normal User only. Admin creates Admin/Owner accounts.</p>
        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 14 }}>{error}</div>}
        <label htmlFor="reg-name" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Full Name (20–60 chars)</label>
        <input id="reg-name" required minLength={20} maxLength={60} value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }} />
        <label htmlFor="reg-email" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Email</label>
        <input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }} />
        <label htmlFor="reg-addr" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Address (max 400)</label>
        <input id="reg-addr" required maxLength={400} value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }} />
        <label htmlFor="reg-pw" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Password (8–16, uppercase + special)</label>
        <input id="reg-pw" type="password" required minLength={8} maxLength={16} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>{loading ? 'Creating account…' : 'Create account'}</button>
        <p style={{ marginTop: 'var(--space-4)', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
}
