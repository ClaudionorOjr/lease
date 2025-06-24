import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma, showLogs } from '@/test/setup-e2e.ts';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Get profile', () => {
  let app: FastifyInstance;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /profile', async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'GET',
      url: '/profile',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      user: expect.objectContaining({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        password: expect.any(String),
        phone: expect.any(String),
        createdAt: user.createdAt.toISOString(),
        updatedAt: expect.any(String),
      }),
    });
  });
});
