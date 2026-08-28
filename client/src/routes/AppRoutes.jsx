import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../components/context/AuthContext';
import Layout from '../components/Layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import StoresPage from '../pages/user/StoresPage';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAddUser from '../pages/admin/AdminAddUser';
import AdminAddStore from '../pages/admin/AdminAddStore';

function RoleRouter() {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Layout role="ADMIN"><div style={{padding:'var(--space-5)'}}><h2>Admin Dashboard</h2><p>Use sidebar navigation — Data from /api/admin/dashboard, /api/users, /api/stores</p></div></Layout>;
  if (user.role === 'OWNER') return <Layout role="OWNER"><div style={{padding:'var(--space-5)'}}><h2>Store Owner Dashboard</h2><p>Average rating + raters list via /api/ratings/&#123;storeId&#125;</p></div></Layout>;
  return <Layout role="USER"><StoresPage /></Layout>;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleRouter />} />
          <Route path="/owner" element={<Layout role="OWNER"><OwnerDashboard /></Layout>} />
          <Route path="/admin/dashboard" element={<Layout role="ADMIN"><AdminDashboard /></Layout>} />
          <Route path="/admin/add-user" element={<Layout role="ADMIN"><AdminAddUser /></Layout>} />
          <Route path="/admin/add-store" element={<Layout role="ADMIN"><AdminAddStore /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
