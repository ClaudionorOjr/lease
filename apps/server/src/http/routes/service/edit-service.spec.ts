import { fakerPT_BR as faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Edit service', () => {
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

  it('should be able to edit a service', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const service = await prisma.service.create({
      data: {
        name: faker.person.fullName(),
        description: faker.lorem.paragraph({ min: 1, max: 3 }),
        priceInCents: faker.number.int({ min: 100, max: 10000 }),
        createdBy: user.id,
      },
    });

    const payload = {
      name: faker.person.fullName(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      price: faker.number.int({ min: 100, max: 10000 }),
    };

    const accessToken = await app.jwt.sign(
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

    const priceInCents = Prisma.Decimal(payload.price * 100);

    expect(response.statusCode).toBe(200);
    expect(serviceOnDatabase).toMatchObject({
      id: service.id,
      name: payload.name,
      description: payload.description,
      priceInCents,
    });
  });
});
