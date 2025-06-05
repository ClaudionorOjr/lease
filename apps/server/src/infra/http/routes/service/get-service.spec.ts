import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Get service', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  beforeEach(async () => {
    app = (await import('@/infra/server')).app;
    prisma = new PrismaClient();

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be able to get a service', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    const service = await prisma.service.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        priceInCents: 1000,
        createdBy: user.id,
      },
    });

    const accessToken = await app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    const response = await app.inject({
      method: 'GET',
      url: `/service/${service.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      service: expect.objectContaining({
        id: service.id,
        name: service.name,
        description: service.description,
        priceInCents: service.priceInCents.toString(),
      }),
    });
  });
});
