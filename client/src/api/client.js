// Centralized API client.
// - Production: set VITE_API_URL (e.g. https://ratestore-api.onrender.com).
// - Local dev: leave it blank; Vite proxies relative /api calls to http://localhost:4000.
export const API_BASE =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, '')) || '';

const TOKEN_KEY = 'ratestore_token';

// In-memory token is the source of truth for in-flight requests; localStorage keeps
// the session across reloads. AuthContext keeps both in sync via setAuthToken.
let authToken = null;
try { authToken = localStorage.getItem(TOKEN_KEY); } catch { /* embedded iframe storage may be restricted */ }

export function setAuthToken(token) {
  authToken = token || null;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore storage errors; in-memory token still works this session */ }
}

export function getToken() {
  if (authToken) return authToken;
  try { authToken = localStorage.getItem(TOKEN_KEY); } catch { /* noop */ }
  return authToken;
}

// Flatten server validation problems into a readable, human message.
export function extractError(data) {
  if (!data) return 'Something went wrong. Please try again.';
  if (Array.isArray(data.details)) {
    const first = data.details.map(d => d.message).filter(Boolean)[0];
    if (first) return first;
  }
  return data.error || 'Something went wrong. Please try again.';
}

function handleAuthFailure() {
  // Self-heal a missing/expired session: clear storage and notify the app. AuthContext
  // listens for this event and logs out smoothly (route guards redirect to /login)
  // without a hard page reload that can race with the post-login navigation.
  setAuthToken(null);
  try { localStorage.removeItem('ratestore_user'); } catch { /* noop */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  let url = `${API_BASE}${path}`;
  if (auth) {
    const token = getToken();
    if (token) {
      // Standard channel: Authorization: Bearer.
      headers.Authorization = `Bearer ${token}`;
      // Fallback for proxies/preview gateways that strip the Authorization header.
      headers['X-Access-Token'] = token;
      const sep = path.includes('?') ? '&' : '?';
      url += `${sep}access_token=${encodeURIComponent(token)}`;
    }
  }
  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include', // also send the httpOnly auth cookie
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth) handleAuthFailure();
  if (!res.ok) {
    const err = new Error(extractError(data));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
};

export default api;
