import { prisma } from '@/test/setup-e2e';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Register user', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;

    prisma.$on('query', (e) => {
      console.log(`[QUERY] ${e.query} — ${e.params}`);
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /user', async () => {
    const payload = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
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
      phone: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
