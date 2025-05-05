import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Edit user', () => {
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

  it('should be able to edit an user', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const payload = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PUT',
      url: `/user/${user.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload,
    });

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(userOnDatabase).toMatchObject({
      id: user.id,
      fullName: payload.fullName,
      email: payload.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
