import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Authenticate user', () => {
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

  it('should be able to authenticate user', async () => {
    const payload = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await app.inject({
      method: 'POST',
      url: '/user',
      headers: {
        'Content-Type': 'application/json',
      },
      payload,
    });

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: {
        email: payload.email,
        password: payload.password,
      },
    });

    console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      accessToken: expect.any(String),
    });
  });
});
