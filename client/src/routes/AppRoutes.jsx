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
  if (user.role === 'ADMIN') return <Layout role="ADMIN"><AdminDashboard /></Layout>;
  if (user.role === 'OWNER') return <Layout role="OWNER"><OwnerDashboard /></Layout>;
  return <Layout role="USER"><StoresPage /></Layout>;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleRouter />} />
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <Layout role="OWNER"><OwnerDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout role="ADMIN"><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout role="ADMIN"><AdminAddUser /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout role="ADMIN"><AdminAddStore /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
