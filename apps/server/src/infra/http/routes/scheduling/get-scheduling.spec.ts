import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Get scheduling', () => {
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

  it('should be able to get a scheduling by id', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const scheduling = await prisma.scheduling.create({
      data: {
        lessor: faker.person.fullName(),
        cpf: faker.number
          .int({ min: 10000000000, max: 99999999999 })
          .toString(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        description: faker.lorem.paragraph({ min: 1, max: 3 }),
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
        createdBy: user.id,
        priceInCents: faker.number.int({ min: 1000, max: 9999 }),
      },
    });

    const accessToken = await app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '7 days',
      },
    );

    const response = await app.inject({
      method: 'GET',
      url: `/scheduling/${scheduling.id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      scheduling: expect.objectContaining({
        id: scheduling.id,
        lessor: scheduling.lessor,
        cpf: scheduling.cpf,
        email: scheduling.email,
        phone: scheduling.phone,
        description: scheduling.description,
        startDate: scheduling.startDate.toISOString(),
        endDate: scheduling.endDate.toISOString(),
        createdAt: scheduling.createdAt.toISOString(),
        updatedAt: scheduling.updatedAt?.toISOString(),
      }),
    });
  });
});
