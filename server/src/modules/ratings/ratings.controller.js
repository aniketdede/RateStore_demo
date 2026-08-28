import { PrismaClient } from '@prisma/client';
import { ratingValueSchema } from '../../validators/index.js';

const prisma = new PrismaClient();

export async function upsertRating(req, res, next) {
  try {
    const { storeId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const parsed = ratingValueSchema.parse(req.body.value ?? req.body);

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const existing = await prisma.rating.findFirst({ where: { userId, storeId } });
    const rating = existing
      ? await prisma.rating.update({ where: { id: existing.id }, data: { value: parsed, updatedAt: new Date() } })
      : await prisma.rating.create({ data: { userId, storeId, value: parsed } });

    res.json({ rating, message: 'Rating submitted/updated successfully' });
  } catch (e) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: e.errors });
    next(e);
  }
}

export async function getMyRatingForStore(req, res, next) {
  try {
    const { storeId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const r = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId } },
      include: { store: { select: { id: true, name: true } } },
    });
    res.json({ rating: r || null });
  } catch (e) { next(e); }
}

export async function getRatingsForStore(req, res, next) {
  try {
    const { storeId } = req.params;
    const store = await prisma.store.findUnique({ where: { id: storeId }, include: { owner: { select: { id: true } } } });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    // Owner can see ratings for their store; others can see if they have access (brief implies owner sees their raters)
    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const avgResult = await prisma.rating.aggregate({ where: { storeId }, _avg: { value: true }, _count: { value: true } });
    res.json({ ratings, averageRating: avgResult._avg.value ?? 0, count: avgResult._count.value ?? 0 });
  } catch (e) { next(e); }
}
