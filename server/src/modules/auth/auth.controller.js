import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userCreateSchema, loginSchema, passwordUpdateSchema, nameSchema, emailSchema, addressSchema } from '../../validators/index.js';

const prisma = new PrismaClient();
// Read at call time (not module-init) so environment is always loaded first.
const getJwtSecret = () => process.env.JWT_SECRET || 'change-me';
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, getJwtSecret(), { expiresIn: '7d' });
}

// Cookie must be cross-site compatible over HTTPS (deployed frontend <-> API, and the
// sandbox preview runs HTTPS). When served over HTTPS use Secure + SameSite=None so the
// browser will send it; plain-HTTP local dev uses SameSite=Lax.
function cookieOptions(req) {
  const https = (req && (req.secure || req.headers['x-forwarded-proto'] === 'https')) || process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: https,
    sameSite: https ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}
function authCookie(req, res, token) {
  return res.cookie('token', token, cookieOptions(req));
}

export async function register(req, res, next) {
  try {
    const parsed = userCreateSchema.parse(req.body);
    // Only Normal Users can self-register (brief rule); Admin creates others
    if (parsed.role && parsed.role !== 'USER') {
      return res.status(403).json({ error: 'Only Normal Users can self-register. Admin must create Admin/Owner accounts.' });
    }
    // Check unique email
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(parsed.password, 12);
    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, passwordHash: hash, address: parsed.address, role: parsed.role || 'USER' },
      select: { id: true, name: true, email: true, role: true },
    });
    const token = signToken(user);
    return authCookie(req, res, token).status(201).json({ user, token });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user || !(await bcrypt.compare(parsed.password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    return authCookie(req, res, token).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    next(e);
  }
}

export async function logout(req, res) {
  res.clearCookie('token', cookieOptions(req));
  return res.json({ message: 'Logged out' });
}

export async function updatePassword(req, res, next) {
  try {
    const parsed = passwordUpdateSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(parsed.currentPassword, user.passwordHash))) {
      return res.status(403).json({ error: 'Current password incorrect' });
    }
    const newHash = await bcrypt.hash(parsed.newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash, updatedAt: new Date() } });
    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    next(e);
  }
}
