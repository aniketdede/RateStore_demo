import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getStores(req, res, next) {
  try {
    const { name, email, address, sortBy = 'name', order = 'asc', page = '1', limit = '10' } = req.query;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy: { [sortBy]: order === 'desc' ? 'desc' : 'asc' },
        skip: (p - 1) * l,
        take: l,
        include: { ratings: { select: { value: true } }, owner: { select: { name: true, email: true } } },
      }),
      prisma.store.count({ where }),
    ]);

    const data = stores.map(s => {
      const vals = s.ratings.map(r => r.value);
      const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
      return { ...s, ratings: undefined, ratingCount: vals.length, averageRating: Math.round(avg * 10) / 10 };
    });

    res.json({ data, meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
  } catch (e) { next(e); }
}
