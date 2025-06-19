import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Edit profile', () => {
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

  test('[PUT] /profile', async () => {
    const user = await userFactory.makePrismaUser();

    const payload = {
      fullName: faker.person.fullName(),
      phone: faker.phone.number(),
    };

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PUT',
      url: '/profile',
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
      email: expect.any(String),
      password: expect.any(String),
      phone: payload.phone,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
