import 'dotenv/config';
import jwt from 'jsonwebtoken';

function resolveSecret() {
  return process.env.JWT_SECRET || 'change-me';
}

export function authMiddleware(req, res, next) {
  // Token can arrive via several channels. The Authorization: Bearer header and the
  // httpOnly cookie are the standard channels. Some preview/proxy gateways strip the
  // Authorization header (and cookies) on forwarded requests, so we also accept a
  // custom header and a query-string fallback (the URL always reaches the server).
  const authHeader = req.headers.authorization || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) token = req.headers['x-access-token'] || null;
  if (!token) token = (req.cookies && req.cookies.token) || null;
  if (!token) token = req.query.access_token || null;

  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, resolveSecret());
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name };
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient role' });
    next();
  };
}
