import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'asc', page = '1', limit = '10' } = req.query;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: order === 'desc' ? 'desc' : 'asc' },
        skip: (p - 1) * l,
        take: l,
        select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ data: users, meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
  } catch (e) { next(e); }
}
