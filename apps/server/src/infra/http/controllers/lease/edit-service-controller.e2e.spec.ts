import { ServiceFactory } from '@/test/factories/make-service.ts';
import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma } from '@/test/setup-e2e.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Edit service', () => {
  let app: FastifyInstance;
  let serviceFactory: ServiceFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    serviceFactory = new ServiceFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[PUT] /service/:serviceId', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const payload = {
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      priceInCents: faker.number.int({ min: 100, max: 10000 }),
    };

    const accessToken = app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    const response = await app.inject({
      method: 'PUT',
      url: `/service/${service.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload,
    });

    const serviceOnDatabase = await prisma.service.findUnique({
      where: {
        id: service.id,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(serviceOnDatabase).toMatchObject({
      id: service.id,
      name: payload.name,
      description: payload.description,
      priceInCents: payload.priceInCents,
      createdBy: user.id,
    });
  });
});
