import { fakerPT_BR as faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Fetch schedulings', () => {
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

  it('should be able to fetch all schedulings', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    await Promise.all([
      prisma.scheduling.create({
        data: {
          lessor: faker.person.fullName(),
          cpf: faker.number
            .int({ min: 10000000000, max: 99999999999 })
            .toString(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          priceInCents: faker.number.int({ min: 100000, max: 999999 }),
          startDate: faker.date.recent(),
          endDate: faker.date.future(),
          createdBy: user.id,
        },
      }),
      prisma.scheduling.create({
        data: {
          lessor: faker.person.fullName(),
          cpf: faker.number
            .int({ min: 10000000000, max: 99999999999 })
            .toString(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          priceInCents: faker.number.int({ min: 100000, max: 999999 }),
          startDate: faker.date.recent(),
          endDate: faker.date.future(),
          createdBy: user.id,
        },
      }),
      prisma.scheduling.create({
        data: {
          lessor: faker.person.fullName(),
          cpf: faker.number
            .int({ min: 10000000000, max: 99999999999 })
            .toString(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          description: faker.lorem.paragraph({ min: 1, max: 3 }),
          priceInCents: faker.number.int({ min: 100000, max: 999999 }),
          startDate: faker.date.recent(),
          endDate: faker.date.future(),
          createdBy: user.id,
        },
      }),
    ]);

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'GET',
      url: '/schedulings',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response.body);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      schedulings: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          lessor: expect.any(String),
          cpf: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          // description: expect.any(String),
          // startDate: expect.any(Date),
          // endDate: expect.any(Date),
          // priceInCents: expect.any(Prisma.Decimal),
          // createdAt: expect.any(Date),
          // updatedAt: expect.any(Date),
        }),
      ]),
    });
  });
});
