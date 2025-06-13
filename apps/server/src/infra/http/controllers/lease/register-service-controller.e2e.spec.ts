import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Register service', () => {
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

  test('[POST] /service', async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    const response = await app.inject({
      method: 'POST',
      url: '/service',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        priceInCents: 100,
      },
    });

    const serviceOnDatabase = await prisma.service.findFirst({
      where: {
        createdBy: user.id,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(serviceOnDatabase).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      priceInCents: expect.toSatisfy((value) => value > 0),
    });
  });
});
