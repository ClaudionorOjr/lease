import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt-ts';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const password = await hash('12345678', 6);

  await prisma.user.create({
    data: {
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      password,
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
