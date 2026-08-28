import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ratestore_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ratestore_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch {}
    }
    const savedToken = localStorage.getItem('ratestore_token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        return { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
      } catch {}
    }
    return null;
  });

  const login = (newToken, userData) => {
    localStorage.setItem('ratestore_token', newToken);
    if (userData) {
      localStorage.setItem('ratestore_user', JSON.stringify(userData));
    }
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ratestore_token');
    localStorage.removeItem('ratestore_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isOwner: user?.role === 'OWNER',
        isUser: user?.role === 'USER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
