import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Delete user', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeEach(async () => {
    app = (await import('src/server.ts')).app;
    prisma = new PrismaClient();

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be able to delete an user', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const response = await app.inject({
      method: 'DELETE',
      url: `/user/${user.id}`,
    });

    expect(response.statusCode).toBe(204);
  });
});
