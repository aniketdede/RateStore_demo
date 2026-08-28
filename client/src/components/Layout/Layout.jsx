import React from 'react';

// Using inline SVG icons (no emoji) per Pro Max rule — lucide-style paths
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M10 21v-6h4v6"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-label="rating star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>;
const IconMenu = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconLogOut = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

export default function Layout({ role = 'USER', children }) {
  const navLinks = [
    { label: 'Dashboard', icon: <IconStore />, active: true },
    { label: 'Stores', icon: <IconStore /> },
    { label: 'Users', icon: <IconUsers /> },
    { label: 'Ratings', icon: <IconStar /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>
      {/* Sidebar — hidden below 1024px */}
      <aside
        aria-label="Main navigation"
        style={{
          width: '260px', flexShrink: 0, background: '#fff', borderRight: '1px solid var(--border-default)',
          padding: 'var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <a href="/" aria-label="RateStore home" style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Rate<span style={{ color: 'var(--accent-teal)' }}>Store</span>
        </a>
        <nav aria-label="Sidebar links" style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href="#"
              aria-current={link.active ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', color: link.active ? 'var(--accent-teal)' : 'var(--text-secondary)', fontWeight: 500, fontSize: 14,
                background: link.active ? 'var(--accent-teal-soft)' : 'transparent',
                borderLeft: link.active ? '3px solid var(--accent-teal)' : '3px solid transparent',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              <span aria-hidden="true" style={{ display: 'inline-flex', color: 'inherit' }}>{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-default)' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 12px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>
            <span aria-hidden="true"><IconLogOut /></span>
            <span>Log out</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, padding: 'var(--space-5)', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>{role === 'ADMIN' ? 'Admin Dashboard' : role === 'OWNER' ? 'Store Dashboard' : 'Store Directory'}</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-meta)', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#EAE3F0' }}>{role}</span>
          </div>
        </header>

        {/* Content area — demonstrates cards + table + accessibility */}
        <section aria-label="Dashboard statistics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {[{ label: 'Total Stores', value: '142', sub: '+3 this week' }, { label: 'Total Ratings', value: '8,391', sub: '+12% vs last month' }, { label: 'Average Rating', value: '4.2', sub: 'Across all stores' }].map(s => (
            <article key={s.label} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }}>
              <small style={{ marginBottom: 'var(--space-2)', display: 'block' }}>{s.label}</small>
              <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{s.value}</div>
              <p style={{ margin: 'var(--space-2) 0 0', fontSize: 13, color: 'var(--accent-teal)', fontWeight: 500 }}>{s.sub}</p>
            </article>
          ))}
        </section>

        <section aria-label="Recent stores" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Registered Stores</h2>
            <a href="#" style={{ fontSize: 14, color: 'var(--accent-teal)', fontWeight: 600, textDecoration: 'none' }}>View all →</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }} aria-label="Store list">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                  <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Name</th>
                  <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Email</th>
                  <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Address</th>
                  <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Premium Hotel Registration Center Facility', email: 'premium@ratestore.local', addr: 'Luxury District, Building 9', rating: 4.8 },
                  { name: 'Government Verified Restaurant Hub Center', email: 'govt@ratestore.local', addr: 'Official Government Zone, Block A', rating: 3.9 },
                ].map(row => (
                  <tr key={row.email} style={{ borderBottom: '1px solid var(--border-default)', transition: 'background 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{row.email}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{row.addr}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--accent-teal)' }}>{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
