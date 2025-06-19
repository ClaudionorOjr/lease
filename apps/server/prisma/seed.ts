import { PrismaClient } from '@prisma/client';
import { env } from '@repo/env';
import { BcryptHasher } from '../src/infra/cryptography/bcrypt-hasher';

const prisma = new PrismaClient();
const hasher = new BcryptHasher();

async function seed() {
  const password = await hasher.hash(env.ADMIN_PASSWORD);

  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { fullName: env.ADMIN_FULLNAME, password, phone: env.ADMIN_PHONE },
    create: {
      fullName: env.ADMIN_FULLNAME,
      email: env.ADMIN_EMAIL,
      password,
      phone: env.ADMIN_PHONE,
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
