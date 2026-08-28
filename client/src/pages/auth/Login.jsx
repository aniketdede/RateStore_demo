import React, { useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token, data.user);
      window.location.href = '/';
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 'var(--space-4)' }}>
      <form onSubmit={handleSubmit} aria-label="Login form" style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>Sign in to RateStore</p>
        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 14 }}>{error}</div>}
        <label htmlFor="email" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Email</label>
        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)', outline: 'none' }} />
        <label htmlFor="password" style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Password</label>
        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)', outline: 'none' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>{loading ? 'Signing in…' : 'Sign in'}</button>
        <p style={{ marginTop: 'var(--space-4)', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>Only Normal Users can self-register. <a href="/register" style={{ color: 'var(--accent-teal)', fontWeight: 600, textDecoration: 'none' }}>Create account</a></p>
      </form>
    </div>
  );
}
