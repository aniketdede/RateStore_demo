import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getToken } from '../../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'ratestore_user';
const TOKEN_KEY = 'ratestore_token';

function readStoredUser(token) {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) return JSON.parse(savedUser);
  } catch { /* noop */ }
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
    }
  } catch { /* noop */ }
  return null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = getToken();
    if (t) setAuthToken(t);
    return t;
  });
  const [user, setUser] = useState(() => readStoredUser(getToken()));

  // When the API says the session is invalid, clear in-app state; route guards then
  // redirect to /login smoothly (no hard reload / navigation race).
  useEffect(() => {
    const onUnauthorized = () => {
      setAuthToken(null);
      try { localStorage.removeItem(USER_KEY); } catch { /* noop */ }
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const login = (newToken, userData) => {
    setAuthToken(newToken); // sync in-memory + localStorage
    if (userData) {
      try { localStorage.setItem(USER_KEY, JSON.stringify(userData)); } catch { /* noop */ }
    }
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setAuthToken(null); // clears in-memory + localStorage token
    try { localStorage.removeItem(USER_KEY); } catch { /* noop */ }
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
