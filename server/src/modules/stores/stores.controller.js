import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

// Whitelist of sortable targets. The rating aggregates are computed in the SELECT
// (aliased, quoted, camelCase) — Postgres folds unquoted ids to lowercase, so we must
// reference the quoted output aliases here rather than raw column names.
const SORTABLE = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: '"averageRating"',
  averageRating: '"averageRating"',
  ratingCount: '"ratingCount"',
};

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export async function getStores(req, res, next) {
  try {
    const { name, email, address, q, ownerId, mine, sortBy = 'name', order = 'asc', page = '1', limit = '10' } = req.query;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    // Safe sorting: only whitelisted columns; direction is binary.
    const sortCol = SORTABLE[sortBy] || SORTABLE.name;
    const dir = order === 'desc' ? 'DESC' : 'ASC';

    const where = [];
    if (q) {
      const like = `%${q}%`;
      where.push(Prisma.sql`(s.name ILIKE ${like} OR s.email ILIKE ${like} OR s.address ILIKE ${like})`);
    }
    if (name) where.push(Prisma.sql`s.name ILIKE ${'%' + name + '%'}`);
    if (email) where.push(Prisma.sql`s.email ILIKE ${'%' + email + '%'}`);
    if (address) where.push(Prisma.sql`s.address ILIKE ${'%' + address + '%'}`);
    if (mine === 'true') {
      if (!req.user?.id) return res.status(401).json({ error: 'Not authenticated' });
      where.push(Prisma.sql`s.owner_id = ${req.user.id}::uuid`);
    }
    if (ownerId) {
      if (!UUID_RE.test(ownerId)) return res.status(400).json({ error: 'Invalid ownerId' });
      where.push(Prisma.sql`s.owner_id = ${ownerId}::uuid`);
    }
    const whereSql = where.length ? Prisma.sql`WHERE ${Prisma.join(where, Prisma.sql` AND `)}` : Prisma.empty;

    // Total count (same filters) for pagination metadata.
    const countRows = await prisma.$queryRaw(Prisma.sql`SELECT COUNT(*)::int AS count FROM stores s ${whereSql}`);
    const total = Number(countRows[0]?.count ?? 0);

    // Aggregate average in SQL so sorting/pagination stay correct (average is computed, never stored).
    const rows = await prisma.$queryRaw(Prisma.sql`
      SELECT s.id, s.name, s.email, s.address, s.owner_id AS "ownerId",
             s.created_at AS "createdAt", s.updated_at AS "updatedAt",
             u.name AS "ownerName", u.email AS "ownerEmail",
             COALESCE(AVG(r.value), 0) AS "averageRating",
             COUNT(r.value)::int AS "ratingCount"
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereSql}
      GROUP BY s.id, u.name, u.email
      ORDER BY ${Prisma.raw(sortCol)} ${Prisma.raw(dir)}
      LIMIT ${l} OFFSET ${(p - 1) * l}
    `);

    const data = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      address: r.address,
      ownerId: r.ownerId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      owner: r.ownerName ? { name: r.ownerName, email: r.ownerEmail } : null,
      averageRating: Math.round(Number(r.averageRating) * 10) / 10,
      ratingCount: Number(r.ratingCount),
    }));

    res.json({ data, meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
  } catch (e) { next(e); }
}

// GET /api/stores/my — the store(s) owned by the logged-in OWNER.
export async function getMyStore(req, res, next) {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ error: 'Not authenticated' });
    const rows = await prisma.$queryRaw(Prisma.sql`
      SELECT s.id, s.name, s.email, s.address, s.owner_id AS "ownerId",
             s.created_at AS "createdAt",
             COALESCE(AVG(r.value), 0) AS "averageRating",
             COUNT(r.value)::int AS "ratingCount"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ${ownerId}::uuid
      GROUP BY s.id
    `);
    const row = rows[0];
    const store = row
      ? {
          id: row.id, name: row.name, email: row.email, address: row.address,
          ownerId: row.ownerId, createdAt: row.createdAt,
          averageRating: Math.round(Number(row.averageRating) * 10) / 10,
          ratingCount: Number(row.ratingCount),
        }
      : null;
    res.json({ store });
  } catch (e) { next(e); }
}
