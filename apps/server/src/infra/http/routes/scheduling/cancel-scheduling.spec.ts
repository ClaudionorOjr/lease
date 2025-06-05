import { fakerPT_BR as faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Cancel scheduling', () => {
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

  it('should be able to cancel a scheduling', async () => {
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

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/schedule/${scheduling.id}/cancel`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const schedulingOnDatabase = await prisma.scheduling.findUnique({
      where: {
        id: scheduling.id,
      },
    });

    expect(response.statusCode).toEqual(204);
    expect(schedulingOnDatabase).toMatchObject({
      id: expect.any(String),
      lessor: scheduling.lessor,
      cpf: scheduling.cpf,
      email: scheduling.email,
      phone: scheduling.phone,
      description: scheduling.description,
      startDate: scheduling.startDate,
      endDate: scheduling.endDate,
      priceInCents: expect.any(Prisma.Decimal),
      createdBy: user.id,
      canceledAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
