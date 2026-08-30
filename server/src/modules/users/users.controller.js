import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Whitelist of sortable columns on the User model (never expose passwordHash etc.).
const SORTABLE = ['name', 'email', 'address', 'role', 'createdAt'];

export async function getUsers(req, res, next) {
  try {
    const { name, email, address, role, q, sortBy = 'name', order = 'asc', page = '1', limit = '10' } = req.query;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const where = {};
    if (q) {
      const like = { contains: q, mode: 'insensitive' };
      where.OR = [{ name: like }, { email: like }, { address: like }];
    } else {
      const like = (v) => ({ contains: v, mode: 'insensitive' });
      if (name) where.name = like(name);
      if (email) where.email = like(email);
      if (address) where.address = like(address);
    }
    if (role) {
      if (!['ADMIN', 'USER', 'OWNER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role filter' });
      }
      where.role = role;
    }

    // Safe sorting: only whitelisted columns; direction is binary.
    const orderByField = SORTABLE.includes(sortBy) ? sortBy : 'name';
    const orderDir = order === 'desc' ? 'desc' : 'asc';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [orderByField]: orderDir },
        skip: (p - 1) * l,
        take: l,
        select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    // Enrich OWNER users with their store name + computed average rating (admin requirement).
    const ownerIds = users.filter(u => u.role === 'OWNER').map(u => u.id);
    const ownerStores = ownerIds.length
      ? await prisma.store.findMany({
          where: { ownerId: { in: ownerIds } },
          select: { ownerId: true, name: true, ratings: { select: { value: true } } },
        })
      : [];
    const ownerMap = new Map();
    for (const s of ownerStores) {
      const vals = s.ratings.map(r => r.value);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      const prev = ownerMap.get(s.ownerId) || { storeName: s.name, averageRating: 0, ratingCount: 0, count: 0, total: 0 };
      prev.ratingCount += vals.length;
      prev.total += vals.reduce((a, b) => a + b, 0);
      prev.count += 1;
      prev.averageRating = prev.ratingCount ? Math.round((prev.total / prev.ratingCount) * 10) / 10 : 0;
      ownerMap.set(s.ownerId, prev);
    }

    const data = users.map(u => {
      const own = ownerMap.get(u.id);
      return own ? { ...u, storeName: own.storeName, storeAverageRating: own.averageRating, storeRatingCount: own.ratingCount } : u;
    });

    res.json({ data, meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
  } catch (e) { next(e); }
}
