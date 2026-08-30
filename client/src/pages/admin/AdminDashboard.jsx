import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/client';
import StarRating from '../../components/Stars/StarRating';

function SortHeader({ label, column, sortBy, order, onSort, style }) {
  const active = sortBy === column;
  return (
    <th style={{ textAlign: 'left', padding: '10px' }}>
      <button onClick={() => onSort(column)} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: active ? 'var(--accent-teal)' : 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <span aria-hidden="true">{active ? (order === 'asc' ? '▲' : '▼') : '↕'}</span>
      </button>
    </th>
  );
}

function FilterInputs({ fields, filters, setFilters }) {
  const inputStyle = { padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', fontSize: 13 };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
      {fields.map(f => f === 'role' ? (
        <select key={f} value={filters.role || ''} onChange={e => setFilters(x => ({ ...x, role: e.target.value }))} style={inputStyle} aria-label="Filter by role">
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
        </select>
      ) : (
        <input
          key={f}
          type="text"
          aria-label={`Filter by ${f}`}
          placeholder={`Filter ${f}…`}
          value={filters[f] || ''}
          onChange={e => setFilters(x => ({ ...x, [f]: e.target.value }))}
          style={inputStyle}
        />
      ))}
    </div>
  );
}

function Pagination({ meta, page, onPrev, onNext }) {
  if (!meta || meta.pages <= 1) return null;
  const btn = { padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-input)', background: '#fff', cursor: 'pointer', fontSize: 13 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)', fontSize: 13, color: 'var(--text-secondary)' }}>
      <button style={btn} disabled={page <= 1} onClick={onPrev}>Prev</button>
      <span>Page {meta.page} of {meta.pages} · {meta.total} total</span>
      <button style={btn} disabled={page >= meta.pages} onClick={onNext}>Next</button>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'asc', page: 1 });
  const [users, setUsers] = useState({ data: [], meta: null });

  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc', page: 1 });
  const [stores, setStores] = useState({ data: [], meta: null });

  useEffect(() => {
    api.get('/api/admin/dashboard').then(setStats).catch(() => {});
  }, []);

  const buildQuery = (filters, sort) => {
    const p = new URLSearchParams({ limit: '8', page: String(sort.page), sortBy: sort.sortBy, order: sort.order });
    Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
    return p.toString();
  };

  const loadUsers = useCallback(async () => {
    try { setUsers(await api.get(`/api/users?${buildQuery(userFilters, userSort)}`)); } catch { setUsers({ data: [], meta: null }); }
  }, [userFilters, userSort]);

  const loadStores = useCallback(async () => {
    try { setStores(await api.get(`/api/stores?${buildQuery(storeFilters, storeSort)}`)); } catch { setStores({ data: [], meta: null }); }
  }, [storeFilters, storeSort]);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadStores(); }, [loadStores]);

  const toggleSort = (setter, column) => setter(s => s.sortBy === column
    ? { ...s, order: s.order === 'asc' ? 'desc' : 'asc', page: 1 }
    : { ...s, sortBy: column, order: 'asc', page: 1 });

  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' };
  const td = { padding: '10px', borderBottom: '1px solid var(--border-default)' };

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 'var(--space-3)' }}>Admin Dashboard</h1>

      <section aria-label="Stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[{ label: 'Total Users', value: stats.totalUsers }, { label: 'Total Stores', value: stats.totalStores }, { label: 'Total Ratings', value: stats.totalRatings }].map(s => (
          <article key={s.label} style={card}>
            <small style={{ color: 'var(--text-meta)' }}>{s.label}</small>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>{s.value ?? '—'}</div>
          </article>
        ))}
      </section>

      <section aria-label="Users table" style={{ ...card, marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Users</h2>
        <FilterInputs fields={['name', 'email', 'address', 'role']} filters={userFilters} setFilters={f => { setUserFilters(f); setUserSort(s => ({ ...s, page: 1 })); }} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Users">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                <SortHeader label="Name" column="name" sortBy={userSort.sortBy} order={userSort.order} onSort={c => toggleSort(setUserSort, c)} />
                <SortHeader label="Email" column="email" sortBy={userSort.sortBy} order={userSort.order} onSort={c => toggleSort(setUserSort, c)} />
                <SortHeader label="Address" column="address" sortBy={userSort.sortBy} order={userSort.order} onSort={c => toggleSort(setUserSort, c)} />
                <SortHeader label="Role" column="role" sortBy={userSort.sortBy} order={userSort.order} onSort={c => toggleSort(setUserSort, c)} />
                <th style={{ textAlign: 'left', padding: '10px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Owner store rating</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map(u => (
                <tr key={u.id}>
                  <td style={{ ...td, fontWeight: 500 }}>{u.name}</td>
                  <td style={{ ...td, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ ...td, color: 'var(--text-secondary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.address}>{u.address}</td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>
                    {u.role === 'OWNER'
                      ? (u.storeName
                          ? <span>{u.storeName}: <strong style={{ color: 'var(--accent-teal)' }}>{Number(u.storeAverageRating || 0).toFixed(1)}</strong> <span style={{ color: 'var(--text-meta)', fontSize: 12 }}>({u.storeRatingCount || 0})</span></span>
                          : <span style={{ color: 'var(--text-meta)' }}>No store assigned</span>)
                      : <span style={{ color: 'var(--text-meta)' }}>—</span>}
                  </td>
                </tr>
              ))}
              {users.data.length === 0 && <tr><td colSpan={5} style={{ padding: 16, color: 'var(--text-meta)' }}>No users match.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination meta={users.meta} page={userSort.page}
          onPrev={() => setUserSort(s => ({ ...s, page: Math.max(1, s.page - 1) }))}
          onNext={() => setUserSort(s => ({ ...s, page: s.page + 1 }))} />
      </section>

      <section aria-label="Stores table" style={card}>
        <h2 style={{ fontSize: 20, marginBottom: 'var(--space-3)' }}>Stores</h2>
        <FilterInputs fields={['name', 'email', 'address']} filters={storeFilters} setFilters={f => { setStoreFilters(f); setStoreSort(s => ({ ...s, page: 1 })); }} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Stores">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                <SortHeader label="Name" column="name" sortBy={storeSort.sortBy} order={storeSort.order} onSort={c => toggleSort(setStoreSort, c)} />
                <SortHeader label="Email" column="email" sortBy={storeSort.sortBy} order={storeSort.order} onSort={c => toggleSort(setStoreSort, c)} />
                <SortHeader label="Address" column="address" sortBy={storeSort.sortBy} order={storeSort.order} onSort={c => toggleSort(setStoreSort, c)} />
                <th style={{ textAlign: 'left', padding: '10px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Owner</th>
                <SortHeader label="Avg Rating" column="averageRating" sortBy={storeSort.sortBy} order={storeSort.order} onSort={c => toggleSort(setStoreSort, c)} />
                <SortHeader label="# Ratings" column="ratingCount" sortBy={storeSort.sortBy} order={storeSort.order} onSort={c => toggleSort(setStoreSort, c)} />
              </tr>
            </thead>
            <tbody>
              {stores.data.map(s => (
                <tr key={s.id}>
                  <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                  <td style={{ ...td, color: 'var(--text-secondary)' }}>{s.email}</td>
                  <td style={{ ...td, color: 'var(--text-secondary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.address}>{s.address}</td>
                  <td style={{ ...td, color: 'var(--text-secondary)' }}>{s.owner?.name || <span style={{ color: 'var(--text-meta)' }}>Unassigned</span>}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <StarRating value={Math.round(s.averageRating || 0)} />
                      <strong style={{ color: 'var(--accent-teal)' }}>{Number(s.averageRating || 0).toFixed(1)}</strong>
                    </span>
                  </td>
                  <td style={td}>{s.ratingCount || 0}</td>
                </tr>
              ))}
              {stores.data.length === 0 && <tr><td colSpan={6} style={{ padding: 16, color: 'var(--text-meta)' }}>No stores match.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination meta={stores.meta} page={storeSort.page}
          onPrev={() => setStoreSort(s => ({ ...s, page: Math.max(1, s.page - 1) }))}
          onNext={() => setStoreSort(s => ({ ...s, page: s.page + 1 }))} />
      </section>
    </div>
  );
}
