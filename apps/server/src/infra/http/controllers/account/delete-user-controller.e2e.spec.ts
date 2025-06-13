import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';

describe('Delete user', () => {
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

  test('[DELETE] /user/:userId', async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'DELETE',
      url: `/user/${user.id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(204);
  });
});
