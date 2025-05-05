import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Create scheduling', () => {
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

  it('should be able to create a new scheduling', async () => {
    const payload = {
      lessor: faker.person.fullName(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
    };

    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'POST',
      url: '/schedule',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload,
    });

    const schedulingOnDatabase = await prisma.scheduling.findFirst({
      where: {
        cpf: payload.cpf,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(schedulingOnDatabase).toMatchObject({
      id: expect.any(String),
      lessor: payload.lessor,
      cpf: payload.cpf,
      email: payload.email,
      phone: payload.phone,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
