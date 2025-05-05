import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Register user', () => {
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

  it('should be able to register a new user', async () => {
    const payload = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/user',
      headers: {
        'Content-Type': 'application/json',
      },
      payload,
    });

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(userOnDatabase).toMatchObject({
      id: expect.any(String),
      fullName: payload.fullName,
      email: payload.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
