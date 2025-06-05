import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
describe('Fetch services', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
    app = (await import('@/infra/server')).app;

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be able to fetch services', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    await Promise.all([
      prisma.service.create({
        data: {
          name: faker.person.fullName(),
          description: faker.lorem.sentence(),
          priceInCents: faker.number.int({ min: 100, max: 1000 }),
          createdBy: user.id,
        },
      }),
      prisma.service.create({
        data: {
          name: faker.person.fullName(),
          description: faker.lorem.sentence(),
          priceInCents: faker.number.int({ min: 100, max: 1000 }),
          createdBy: user.id,
        },
      }),
      prisma.service.create({
        data: {
          name: faker.person.fullName(),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          priceInCents: faker.number.int({ min: 100, max: 1000 }),
          createdBy: user.id,
        },
      }),
    ]);

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
      url: '/services',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const services = JSON.parse(response.body).services;

    expect(response.statusCode).toEqual(200);
    expect(services).toHaveLength(3);
    expect(services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          priceInCents: expect.any(String),
        }),
      ]),
    );
  });
});
