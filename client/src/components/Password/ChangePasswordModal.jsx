import React, { useState } from 'react';
import api from '../../api/client';

const pwRules = (v) => {
  const errors = [];
  if (v.length < 8 || v.length > 16) errors.push('Password must be 8–16 characters.');
  if (!/[A-Z]/.test(v)) errors.push('Include at least one uppercase letter.');
  if (!/[^A-Za-z0-9]/.test(v)) errors.push('Include at least one special character.');
  return errors;
};

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const clientErrors = newPassword ? pwRules(newPassword) : [];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentPassword) { setError('Enter your current password.'); return; }
    if (clientErrors.length) { setError(clientErrors[0]); return; }
    setSaving(true);
    try {
      await api.post('/api/auth/password', { currentPassword, newPassword });
      setDone(true);
      setTimeout(onClose, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 14, marginBottom: 'var(--space-4)' };

  return (
    <div role="dialog" aria-modal="true" aria-label="Change password" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,35,50,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', zIndex: 50 }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit}
        style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-card-hover)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>Change password</h2>
        <p style={{ marginBottom: 'var(--space-4)', fontSize: 13 }}>Use 8–16 characters with an uppercase letter and a special character.</p>

        {error && <div role="alert" style={{ background: '#fdeaea', color: '#b23a2e', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 13 }}>{error}</div>}
        {done && <div role="status" style={{ background: '#e8f6f1', color: '#2e7d67', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 13 }}>Password updated successfully.</div>}

        <label htmlFor="cur-pw">Current password</label>
        <input id="cur-pw" type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrent(e.target.value)} style={inputStyle} />

        <label htmlFor="new-pw">New password</label>
        <input id="new-pw" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNew(e.target.value)} style={inputStyle} />
        {newPassword && clientErrors.length > 0 && (
          <ul style={{ marginTop: -8, marginBottom: 'var(--space-4)', paddingLeft: 18, color: '#b23a2e', fontSize: 12 }}>
            {clientErrors.map((er, i) => <li key={i}>{er}</li>)}
          </ul>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={saving || done} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: saving || done ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
}
