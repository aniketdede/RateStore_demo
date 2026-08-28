import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { userCreateSchema, storeCreateSchema } from '../../validators/index.js';

const prisma = new PrismaClient();

export async function getDashboardStats(req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (e) { next(e); }
}

export async function addUser(req, res, next) {
  try {
    const parsed = userCreateSchema.parse(req.body);
    const hash = await bcrypt.hash(parsed.password, 12);
    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, passwordHash: hash, address: parsed.address, role: parsed.role || 'USER' },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ user, message: 'User created by admin' });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    if (e.code === 'P2002') return res.status(409).json({ error: 'Email already exists' });
    next(e);
  }
}

export async function addStore(req, res, next) {
  try {
    const parsed = storeCreateSchema.parse(req.body);
    const store = await prisma.store.create({
      data: { name: parsed.name, email: parsed.email, address: parsed.address, ownerId: parsed.ownerId || null },
      include: { owner: { select: { name: true } } },
    });
    res.status(201).json({ store, message: 'Store created by admin' });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    if (e.code === 'P2002') return res.status(409).json({ error: 'Store email already exists' });
    next(e);
  }
}
