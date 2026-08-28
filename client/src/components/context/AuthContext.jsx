import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [token, setToken] = useState(localStorage.getItem('ratestore_token') || null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
      } catch { setUser(null); }
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('ratestore_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ratestore_token');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'ADMIN', isOwner: user?.role === 'OWNER', isUser: user?.role === 'USER' }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
