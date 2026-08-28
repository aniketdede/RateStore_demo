import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M10 21v-6h4v6"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>;
const IconLogOut = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

export default function Layout({ role = 'USER', children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login', { replace: true });
  };

  const getNavLinks = () => {
    if (role === 'ADMIN') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <IconStore /> },
        { label: 'Add User', path: '/admin/add-user', icon: <IconUsers /> },
        { label: 'Add Store', path: '/admin/add-store', icon: <IconPlus /> },
      ];
    }
    if (role === 'OWNER') {
      return [
        { label: 'Owner Dashboard', path: '/owner', icon: <IconStore /> },
      ];
    }
    return [
      { label: 'All Stores', path: '/', icon: <IconStore /> },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>
      {/* Sidebar */}
      <aside
        aria-label="Main navigation"
        style={{
          width: '260px', flexShrink: 0, background: '#fff', borderRight: '1px solid var(--border-default)',
          padding: 'var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <Link to="/" aria-label="RateStore home" style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Rate<span style={{ color: 'var(--accent-teal)' }}>Store</span>
        </Link>
        <nav aria-label="Sidebar links" style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)', fontWeight: 500, fontSize: 14,
                  background: isActive ? 'var(--accent-teal-soft)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-teal)' : '3px solid transparent',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
              >
                <span aria-hidden="true" style={{ display: 'inline-flex', color: 'inherit' }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ marginBottom: 'var(--space-3)', padding: '0 12px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-meta)' }}>{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 12px', borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14, background: 'none', border: 'none', width: '100%',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span aria-hidden="true"><IconLogOut /></span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, padding: 'var(--space-5)', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>
              {role === 'ADMIN' ? 'Admin Management' : role === 'OWNER' ? 'Owner Portal' : 'Store Directory'}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#EAE3F0' }}>
              {role}
            </span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
