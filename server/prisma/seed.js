import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const HASH_ROUNDS = 12;

async function hash(pw) {
  return bcrypt.hash(pw, HASH_ROUNDS);
}

async function main() {
  // Ensure validation passes: names 20-60 chars, email valid, address <=400, password 8-16 with uppercase + special
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ratestore.local' },
    update: {},
    create: {
      name: 'Administrator User Account Principal', // 36 chars
      email: 'admin@ratestore.local',
      passwordHash: await hash('AdminPass1!'),
      address: 'Admin Office Building, Main Street Corridor, Building 4, Block C, City Center, Country',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@ratestore.local' },
    update: {},
    create: {
      name: 'Standard Platform User Account Profile', // 35 chars
      email: 'user@ratestore.local',
      passwordHash: await hash('UserPass2!'),
      address: 'Normal Residential Area, Street 12, Apartment 3B, District Zone, Postal Area',
      role: Role.USER,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@ratestore.local' },
    update: {},
    create: {
      name: 'Store Owner Principal Account Profile', // 36 chars
      email: 'owner@ratestore.local',
      passwordHash: await hash('OwnerPass3!'),
      address: 'Business Complex Unit 7, Commercial District, Main Road, City Center',
      role: Role.OWNER,
    },
  });

  const store1 = await prisma.store.upsert({
    where: { email: 'premium@ratestore.local' },
    update: {},
    create: {
      name: 'Premium Hotel Registration Center Facility', // 37 chars
      email: 'premium@ratestore.local',
      address: 'Luxury District, Building 9, Ground Floor, Near Central Park, City Center, Country',
      ownerId: owner.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'govt@ratestore.local' },
    update: {},
    create: {
      name: 'Government Verified Restaurant Hub Center', // 39 chars
      email: 'govt@ratestore.local',
      address: 'Official Government Zone, Block A, Street 22, Commercial Complex, Postal Code Area',
      ownerId: null,
    },
  });

  // Seed a rating from user to store1 (value 4) — use find + create/update to avoid compound-unique syntax risk
  const existingRating = await prisma.rating.findFirst({ where: { userId: user.id, storeId: store1.id } });
  if (existingRating) {
    await prisma.rating.update({ where: { id: existingRating.id }, data: { value: 4 } });
  } else {
    await prisma.rating.create({ data: { userId: user.id, storeId: store1.id, value: 4 } });
  }

  console.log('Seed complete. Admin:', admin.email, '| User:', user.email, '| Owner:', owner.email);
  console.log('Stores:', store1.email, store2.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
